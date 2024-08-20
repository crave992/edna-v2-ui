export default function SkeletonLesson({
  status,
  expanded,
}: {
  status: string | undefined;
  expanded: boolean | undefined;
}) {
  return (
    <div className={`skeleton tw-flex ${expanded ? 'tw-flex-row' : 'tw-flex-col'} tw-px-2xl tw-py-xl tw-gap-xl`}>
      {[...Array(3)].map((_, index) => (
        <div key={index}>
          <div className={`tw-rounded-md tw-bg-gray-300 tw-min-w-[170px] tw-h-[87px] tw-animate-pulse`}></div>
        </div>
      ))}
    </div>
  );
}
