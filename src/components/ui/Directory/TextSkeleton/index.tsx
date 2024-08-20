export default function TextSkeleton({ width } : { width: number}) {
  return (
    <div className={`skeleton tw-flex tw-flex-row tw-items-center tw-justify-between tw-w-full`}>
      <div className={`tw-h-[20px] tw-flex tw-bg-gray-300 tw-rounded-full tw-animate-pulse`} style={{ width }}>
      </div>
    </div>
  );
}
