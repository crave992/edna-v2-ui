export default function HeaderSkeleton() {
  return (
    <div className={`skeleton tw-flex tw-flex-row tw-justify-between tw-w-full`}>
      <div className="tw-flex tw-space-x-xl">
        <div className="tw-rounded-full tw-bg-gray-300 tw-h-[56px] tw-w-[56px] tw-animate-pulse"></div>
        <div className="tw-flex tw-flex-col">
          <div className="tw-w-[200px] tw-flex tw-mt-[7px] tw-bg-gray-400 tw-h-[18px] tw-rounded-full tw-animate-pulse tw-items-center"></div>
          <div className="tw-w-[220px] tw-flex tw-mt-[7px] tw-bg-gray-300 tw-h-[14px] tw-rounded-full tw-animate-pulse tw-items-center"></div>
        </div>
      </div>
      <div className="tw-flex tw-items-center tw-space-x-lg">
        <div className="tw-w-[132px] tw-flex tw-mt-[7px] tw-bg-gray-300 tw-h-[40px] tw-rounded-md tw-animate-pulse tw-items-center"></div>
        <div className="tw-w-[83px] tw-flex tw-mt-[7px] tw-bg-gray-300 tw-h-[40px] tw-rounded-md tw-animate-pulse tw-items-center"></div>
      </div>
    </div>
  );
}
