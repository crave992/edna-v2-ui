export default function SkeletonTopic() {
    return (
      <div className="skeleton tw-flex tw-flex-col tw-space-y-md">
        {[...Array(5)].map((_, index) => (
          <div key={index} className='tw-rounded-md tw-bg-gray-300 tw-h-[36px] tw-w-[160px] tw-mr-4xl tw-animate-pulse'></div>
        ))}
      </div>
    )
  }