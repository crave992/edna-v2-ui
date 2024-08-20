const loadingArray = [0, 1, 2];

export const LevelAreaCardSkeleton = () => {
  return (
    <>
      {loadingArray.map((number) => {
        return (
          <>
            <div
              className={`tw-flex tw-flex-row tw-flex-1 tw-h-[71px] tw-p-lg tw-rounded-md  tw-bg-gray-300 tw-animate-pulse`}
            ></div>
          </>
        );
      })}
    </>
  );
};
