interface MilestoneSkeletonProps {
  noBorder: boolean;
}

const loadingArray = [0, 1, 2];

export const StudentMilestoneSkeleton = ({ noBorder }: MilestoneSkeletonProps) => {
  return (
    <>
      {loadingArray.map((number) => {
        return (
          <div className={`tw-pb-xl tw-flex-wrap tw-flex  tw-flex-row tw-items-start tw-justify-start tw-space-x-lg`} key={`student-milestone-skeleton-${number}`}>
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

export default StudentMilestoneSkeleton;
