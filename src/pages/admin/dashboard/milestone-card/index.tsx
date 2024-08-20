import Avatar from '@/components/ui/Avatar';
import { StudentMilestoneDto } from '@/dtos/StudentDto';
import Image from 'next/image';

interface MilestoneProps {
  milestone: StudentMilestoneDto;
  isLast: boolean;
}

const timeAgo = (dateString: string): string => {
  const givenDate = new Date(dateString);
  const now = new Date();

  const diffInSeconds = Math.floor((now.getTime() - givenDate.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30); // Approximation
  const diffInYears = Math.floor(diffInDays / 365); // Approximation

  if (diffInMinutes < 1) {
    return `${diffInSeconds} ${diffInSeconds === 1 ? 'second' : 'seconds'} ago`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  } else {
    return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
  }
};

const MilestoneCard = ({ milestone, isLast }: MilestoneProps) => {
  const convertStatus = () => {
    let status = milestone?.lessonState;
    if (status === 'review') return 'is reviewing';
    else if (status === 'acquired') return 'has acquired';
    else if (status === 'planned') return 'is planning to learn';
    else return 'is practicing';
  };
  
  return (
    <div
      className={`tw-pb-xl tw-flex-wrap tw-flex tw-border-b tw-border-0 tw-border-solid tw-border-secondary tw-flex tw-flex-row tw-items-start tw-justify-start tw-space-x-lg ${
        isLast ? 'tw-border-b-0' : ''
      }`}
    >
      <div>
        <Avatar
          link={milestone?.createdBy?.profilePicture || ''}
          photoSize={48}
          alt={milestone?.createdBy?.fullName}
          firstName={milestone?.createdBy?.fullName.split(' ')[0]}
          lastName={
            milestone?.createdBy?.fullName.split(' ')[milestone?.createdBy?.fullName.split(' ').length - 1] || ''
          }
        />
      </div>
      <div className="tw-space-y-lg tw-w-[300px]">
        <div className="">
          <div className="tw-flex tw-items-center tw-justify-start tw-space-x-md">
            <div className="tw-text-sm-medium tw-text-secondary">
              {/* {milestone?.student?.firstName} {milestone?.student?.lastName} */}
              {milestone?.createdBy.fullName}
            </div>
            <div className="tw-text-xs-regular tw-text-tertiary">{timeAgo(milestone?.createdOn)}</div>
          </div>
          <div>
            <div className="tw-text-sm-regular tw-text-tertiary tw-truncate">
              {/* {milestone?.student?.firstName} {milestone?.student?.lastName} {convertStatus()} {milestone?.lesson} */}
              {milestone?.title}.
            </div>
          </div>
        </div>
        <div className="tw-border tw-border-solid tw-border-secondary tw-rounded-xl tw-overflow-hidden">
          <div>
            <Image
              width={300}
              height={172}
              alt=""
              className="tw-h-[172px] tw-w-[300px]"
              src={milestone?.lessonImageUrl}
            />
          </div>
          {milestone?.lessonImageCaption && milestone?.lessonImageCaption !== '' && (
            <div className="tw-p-lg tw-pt-md tw-text-sm-regular tw-text-secondary tw-bg-primary">
              {milestone?.lessonImageCaption ?? ''}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default MilestoneCard;
