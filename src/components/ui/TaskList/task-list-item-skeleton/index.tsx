const loadingArray = [0, 1, 2];

export const TaskListItemSkeleton = () => {
  return (
    <>
      {loadingArray.map((number) => {
        return (
          <div className="tw-flex tw-w-full tw-gap-x-md" key={`task-list-item-skeleton-${number}`}>
            <div
              className={`tw-flex tw-basis-[10px] tw-flex-row tw-w-[10px] tw-h-[20px] tw-p-lg tw-rounded-md  tw-bg-gray-300 tw-animate-pulse`}
            ></div>
            <div
              className={`tw-flex tw-flex-row tw-flex-1 tw-h-[20px] tw-w-full tw-p-lg tw-rounded-md  tw-bg-gray-300 tw-animate-pulse`}
            ></div>
          </div>
        );
      })}
    </>
  );
};
