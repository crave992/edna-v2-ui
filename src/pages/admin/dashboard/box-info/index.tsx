import { AdminDashboardStatistics } from '@/dtos/AdminDashboardCountDto';
interface BoxInfoProps {
  data: AdminDashboardStatistics;
}

const BoxInfo = ({ data }: BoxInfoProps) => {
  return (
    <div className="tw-pt-4xl tw-gap-xl tw-flex-wrap tw-flex">
      <div className="tw-gap-y-md tw-p-3xl tw-bg-primary tw-rounded-xl tw-border-secondary tw-border-solid tw-border tw-flex-1 tw-justify-center tw-items-center tw-text-center">
        <div className="tw-text-sm-medium tw-text-tertiary">Students</div>
        <div className="tw-text-display-md-semibold tw-text-primary">{data?.studentCount}</div>
      </div>

      <div className="tw-gap-y-md tw-p-3xl tw-bg-primary tw-rounded-xl tw-border-secondary tw-border-solid tw-border tw-flex-1 tw-justify-center tw-items-center tw-text-center">
        <div className="tw-text-sm-medium tw-text-tertiary">Boys</div>
        <div className="tw-text-display-md-semibold tw-text-primary">{data?.maleCount}</div>
      </div>

      <div className="tw-gap-y-md tw-p-3xl tw-bg-primary tw-rounded-xl tw-border-secondary tw-border-solid tw-border tw-flex-1 tw-justify-center tw-items-center tw-text-center">
        <div className="tw-text-sm-medium tw-text-tertiary">Girls</div>
        <div className="tw-text-display-md-semibold tw-text-primary">{data?.femaleCount}</div>
      </div>

      <div className="tw-gap-y-md tw-p-3xl tw-bg-primary tw-rounded-xl tw-border-secondary tw-border-solid tw-border tw-flex-1 tw-justify-center tw-items-center tw-text-center">
        <div className="tw-text-sm-medium tw-text-tertiary">Guides</div>
        <div className="tw-text-display-md-semibold tw-text-primary">{data?.guideCount}</div>
      </div>

      <div className="tw-gap-y-md tw-p-3xl tw-bg-primary tw-rounded-xl tw-border-secondary tw-border-solid tw-border tw-flex-1 tw-justify-center tw-items-center tw-text-center">
        <div className="tw-text-sm-medium tw-text-tertiary">Staff</div>
        <div className="tw-text-display-md-semibold tw-text-primary">{data?.staffCount}</div>
      </div>
    </div>
  );
};

export const BoxInfoSkeleton = () => {
  return (
    <div className="tw-pt-4xl tw-gap-xl tw-flex-wrap tw-flex">
      <div className={`tw-flex tw-h-[113px] tw-p-lg tw-rounded-xl tw-bg-gray-300 tw-animate-pulse tw-flex-1`}></div>

      <div className={`tw-flex tw-h-[113px] tw-p-lg tw-rounded-xl tw-bg-gray-300 tw-animate-pulse tw-flex-1`}></div>

      <div className={`tw-flex tw-h-[113px] tw-p-lg tw-rounded-xl tw-bg-gray-300 tw-animate-pulse tw-flex-1`}></div>

      <div className={`tw-flex tw-h-[113px] tw-p-lg tw-rounded-xl tw-bg-gray-300 tw-animate-pulse tw-flex-1`}></div>

      <div className={`tw-flex tw-h-[113px] tw-p-lg tw-rounded-xl tw-bg-gray-300 tw-animate-pulse tw-flex-1`}></div>
    </div>
  );
};
export default BoxInfo;
