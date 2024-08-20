const loadingArray = [0, 1, 2];

export const MilestonesCardSkeletonDashboard = () => {
  return (
    <>
      {loadingArray.map((number, index) => {
        return (
          <div
            className={`tw-pb-xl tw-flex-wrap tw-flex tw-border-b tw-border-0 tw-border-solid tw-border-secondary tw-flex tw-flex-row tw-items-start tw-justify-start tw-space-x-lg ${
              index === 2 ? 'tw-border-b-0' : ''
            }`}
            key={`milestones-card-skeleton-dashboard-${number}`}
          >
            <div>
              <div className="tw-mb-3xl tw-rounded-full tw-bg-gray-300 tw-w-[48px] tw-h-[48px] tw-animate-pulse"></div>
            </div>
            <div className="tw-space-y-lg tw-w-[300px]">
              <div className="">
                <div className="tw-flex tw-items-center tw-justify-start tw-space-x-md">
                  <div className="tw-rounded-full tw-bg-gray-300 tw-h-[20px] tw-w-full tw-animate-pulse"></div>
                  <div className="tw-rounded-full tw-bg-gray-300 tw-h-[20px] tw-w-[50px] tw-animate-pulse"></div>
                </div>
                <div>
                  <div className="tw-rounded-full tw-mt-md tw-bg-gray-300 tw-h-[20px] tw-w-full tw-animate-pulse"></div>
                </div>
              </div>
              <div className="tw-overflow-hidden">
                <div>
                  <div className="tw-rounded-xl tw-mt-md tw-bg-gray-300 tw-h-[172px] tw-w-[300px] tw-animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default MilestonesCardSkeletonDashboard;
