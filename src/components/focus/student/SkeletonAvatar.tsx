export default function SkeletonAvatar({ direction = 'row' }) {
  return (
    <div className={`skeleton tw-flex ${direction === 'column' ? 'tw-flex-col' : 'tw-flex-row'}`}>
      {[...Array(3)].map((_, index) => (
        <div key={index} className={`${direction === 'column' ? 'tw-mt-[30px]' : 'tw-mr-[30px]'}`}>
          <div className="tw-rounded-full tw-bg-gray-300 tw-h-[56px] tw-w-[56px] tw-animate-pulse"></div>
          <div className="tw-flex tw-mt-[5px] tw-w-12/12 tw-bg-gray-300 tw-h-[18px] tw-rounded-full tw-animate-pulse tw-content-center tw-items-center"></div>
        </div>
      ))}
    </div>
  );
}
