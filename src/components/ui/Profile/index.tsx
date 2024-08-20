import UserDto from '@/dtos/UserDto';
import Avatar from '../Avatar';

interface ProfileProps {
  user: UserDto;
}

export function Profile({ user }: ProfileProps) {
  return (
    <div className="tw-flex tw-flex-row tw-items-center tw-h-[64px] tw-py-lg tw-px-xl first:tw-rounded-t-lg tw-space-x-lg">
      <Avatar link={user.profilePicture} alt={user.fullName} photoSize={40} />
      <div className="tw-flex tw-flex-col tw-flex-grow">
        <div className="tw-truncate tw-text-sm-semibold tw-text-secondary tw-max-w-[160px]">{user.fullName}</div>
        <div className="tw-truncate tw-text-sm-regular tw-text-tertiary tw-max-w-[160px]">{user.email}</div>
      </div>
    </div>
  );
}
