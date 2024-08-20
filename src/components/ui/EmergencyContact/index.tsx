import Avatar from '@/components/ui/Avatar';

type EmergencyContactProps = {
  relationship: string;
  name: string;
  contactNumber: string;
  photo?: string;
  photoSize?: number;
};

export default function EmergencyContact({
  relationship,
  name,
  contactNumber,
  photo,
  photoSize,
}: EmergencyContactProps) {
  return (
    <>
      <div className="tw-flex tw-w-[208px] tw-p-lg tw-mr-md tw-bg-secondary tw-rounded-md tw-space-x-md">
        <div className="tw-flex tw-items-center tw-justify-center">
          <div className={`${photoSize ? `tw-w-[${photoSize}px]` : 'tw-w-[40px]'} tw-text-center`}>
            <Avatar link={photo || ''} photoSize={photoSize ?? 40} alt={name} />
          </div>
        </div>
        <div className={`${photo && 'tw-ml-md'}`}>
          <div className="tw-text-xxs-regular">{relationship.toUpperCase()}</div>
          <div className="tw-text-md-medium">{name}</div>
          <div className="tw-text-sm-regular">
            <a className="tw-block tw-text-sm-regular hover:tw-text-secondary tw-text-secondary" href={`tel:${contactNumber}`}>
              {contactNumber !== null && contactNumber !== 'null' && contactNumber !== '-' ? contactNumber : ''}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
