import Image from 'next/image';
import siteMetadata from '@/constants/siteMetadata';

function ImageBrand({ size }: { size?: number }) {
  return (
    <Image
      src={siteMetadata.siteLogo}
      alt={siteMetadata.title}
      width={size ?? siteMetadata.siteLogoWidth}
      height={size ?? siteMetadata.siteLogoHeight}
      priority
    />
  );
}

export default ImageBrand;
