export default function GuideSkeleton() {
  return (
    <div className="skeleton tw-flex tw-flex-row tw-gap-xl">
      {[...Array(2)].map((_, index) => (
        <div
          key={index}
          className="tw-flex tw-h-[68px] tw-w-[182px] tw-py-lg tw-pl-xl tw-pr-3xl tw-rounded-full tw-bg-white tw-border tw-border-solid tw-border-secondary tw-cursor-pointer"
        >
          <div className="tw-flex tw-space-x-lg tw-items-center tw-justify-center">
            <div className="tw-w-[43px] tw-h-[43px] tw-rounded-full tw-bg-gray-300 tw-animate-pulse"></div>
            <div className="tw-flex tw-flex-col tw-gap-y-lg">
              <div className="tw-w-[70px] tw-h-[10px] tw-rounded-md tw-bg-gray-300 tw-animate-pulse"></div>
              <div className="tw-w-[88px] tw-h-[13px] tw-rounded-md tw-bg-gray-300 tw-animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
