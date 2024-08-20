export default function AttendanceSkeleton() {
  return (
    <div className="skeleton tw-flex tw-flex-col">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="tw-flex tw-items-center tw-space-x-lg tw-justify-between tw-py-3xl tw-border-t-0 tw-border-x-0 tw-border-b-1 tw-border-solid tw-border-secondary">
          <div className="tw-flex tw-items-center tw-space-x-lg">
            <div className="tw-rounded-full tw-bg-gray-300 tw-h-[56px] tw-w-[56px] tw-animate-pulse"></div>
            <div className="tw-w-[80px] tw-bg-gray-300 tw-h-[18px] tw-rounded-full tw-animate-pulse"></div>
          </div>
          <div className="tw-flex tw-w-[94px] tw-h-[40px] tw-bg-gray-300 tw-rounded-xl tw-animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}
