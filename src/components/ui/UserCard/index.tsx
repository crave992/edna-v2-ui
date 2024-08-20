import Avatar from '@/components/ui/Avatar';
import { useRouter } from 'next/router';
import { useFocusContext } from '@/context/FocusContext';

interface ClassStatsProps {
  data: any;
  type: string;
  topText?: string;
  bottomText?: string;
}

const UserCard = ({ data, type, topText, bottomText }: ClassStatsProps) => {
  const router = useRouter();
  const { currentUserRoles } = useFocusContext();

  const profileUrl =
    data.parentId && data.parentId > 0 ? `/directory/parent/${data.parentId}` : `/${type.toLowerCase()}/${data?.id}`;

  return (
    <div
      onClick={() => currentUserRoles?.hasSuperAdminRoles && router.push(profileUrl)}
      className={`tw-flex tw-h-[68px] tw-w-[208px] tw-py-lg tw-pl-xl tw-pr-3xl tw-rounded-full tw-bg-secondary tw-border tw-border-solid tw-border-secondary ${
        currentUserRoles?.hasSuperAdminRoles && data.parentId ? 'tw-cursor-pointer' : 'tw-pointer-events-none'
      }`}
    >
      <div className="tw-flex tw-space-x-lg tw-items-center tw-justify-center">
        <Avatar
          link={data?.profilePhoto || data?.profilePicture}
          photoSize={43}
          firstName={data?.firstName}
          lastName={data?.lastName}
        />
        <div className="tw-flex tw-flex-col tw-text-left tw-w-28">
          <div className="tw-text-xs-regular tw-text-tertiary">{topText}</div>
          <div className="tw-text-md-medium tw-text-secondary tw-overflow-hidden tw-whitespace-nowrap tw-overflow-ellipsis tw-max-w-full">
            {`${data.firstName} ${data.lastName}`}
          </div>
          <div className="tw-text-sm-regular tw-text-secondary">{bottomText}</div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
