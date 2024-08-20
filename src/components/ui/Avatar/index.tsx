import AvatarIcon from '@/components/svg/Avatar';
import { getInitials } from '@/utils/focusAvatarFn';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type AvatarProps = {
  link: string;
  alt?: string;
  photoSize?: number;
  firstName?: string;
  lastName?: string;
  noImage?: boolean;
};

export default function Avatar({ link, alt, photoSize, firstName, lastName, noImage }: AvatarProps) {
  const [imgSrc, setImgSrc] = useState<string>('');

  useEffect(() => {
    setImgSrc(link);
  }, [link]);

  return (
    <div className="tw-flex tw-items-center tw-justify-center" style={{ width: photoSize ?? 48 }}>
      {link !== '' ? (
        <Image
          className="tw-rounded-full"
          src={imgSrc}
          alt={alt ?? ''}
          width={photoSize ? photoSize : 48}
          height={photoSize ? photoSize : 48}
          onError={() => {
            setImgSrc('/images/fallback.png');
          }}
          priority
        />
      ) : (
        <div
          className={`tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-avatar tw-ring-secondary tw-ring-1 ${
            photoSize == 16
              ? 'tw-text-xxs-medium'
              : photoSize == 24
              ? 'tw-text-sm-semibold'
              : photoSize == 40
              ? 'tw-text-md-semibold'
              : photoSize == 56
              ? 'tw-text-xl-semibold'
              : photoSize == 90
              ? 'tw-text-display-md-semibold'
              : 'tw-text-lg-semibold'
          } tw-text-quarterary`}
          style={{
            width: photoSize ? `${photoSize}px` : '48px',
            height: photoSize ? `${photoSize}px` : '48px',
          }}
        >
          {noImage ? null : firstName && lastName ? (
            getInitials(firstName, lastName)
          ) : (
            <AvatarIcon size={photoSize ? photoSize - photoSize / 4 : 30} />
          )}
        </div>
      )}
    </div>
  );
}
