export default function BirthdaySkeleton() {
  return (
    <div className="skeleton tw-flex tw-flex-row tw-gap-xl">
      <div
        className="tw-min-w-[132px] tw-h-[176.05px] tw-flex tw-flex-col tw-items-center tw-justify-center tw-rounded-xl tw-space-y-md tw-border tw-border-solid tw-border-secondary"
      >
        <div className="tw-text-xs-regular tw-text-secondary tw-w-[80px] tw-h-[18px] tw-rounded-md tw-bg-gray-300 tw-animate-pulse"></div>
        <div className="tw-rounded-full tw-w-[90px] tw-h-[90px] tw-bg-gray-300 tw-animate-pulse"></div>
        <div className="tw-text-lg-medium tw-text-primary tw-w-[95px] tw-h-[28px] tw-rounded-md tw-bg-gray-300 tw-animate-pulse"></div>
      </div>
    </div>
  );
}
