export default function SkeletonBar({ width = '512px', height = '25px' }) {
  return (
    <div className={`skeleton tw-flex tw-flex-col`} style={{width: width}}>
      <div className="">
        <div className={`tw-rounded-md tw-bg-gray-300 tw-h-[15px] tw-w-full tw-animate-pulse`} style={{height: height}}></div>
      </div>
    </div>
  );
}
