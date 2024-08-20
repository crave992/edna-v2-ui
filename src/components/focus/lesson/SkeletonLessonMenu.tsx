export default function SkeletonLessonMenu() {
  return (
    <div className="skeleton tw-flex tw-flex-row">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="tw-mr-[16px]">
          <div className='tw-rounded-md tw-bg-gray-300 tw-h-[85px] tw-w-[170px] tw-animate-pulse'></div>
        </div>
      ))}
    </div>
  )
}