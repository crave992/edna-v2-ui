export default function SkeletonTable() {
  return (
    <div className="skeleton tw-flex tw-flex-col">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="tw-m-xl tw-mx-0">
          <div className="tw-rounded-md tw-bg-gray-300 tw-h-[35px] tw-w-full tw-animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}
