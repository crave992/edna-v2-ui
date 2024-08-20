export default function SkeletonArea() {
  return (
    <div className="skeleton-area tw-flex tw-flex-row tw-space-x-xl tw-items-center">
      <div className='tw-rounded-md tw-bg-gray-300 tw-h-[36px] tw-w-[64px] tw-animate-pulse'></div>
      <div className='tw-rounded-md tw-bg-gray-300 tw-h-[36px] tw-w-[115px] tw-animate-pulse'></div>
      <div className='tw-rounded-full tw-bg-gray-300 tw-h-[32px] tw-w-[32px] tw-animate-pulse'></div>
    </div>
  )
}