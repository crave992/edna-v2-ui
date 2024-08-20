export default function LessonOverViewSkeleton() {
  return (
    <div className="skeleton tw-flex tw-flex-row tw-gap-xl" style={{ height: 'calc(100vh - 230px)' }}>
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="tw-w-[299px] tw-space-y-xl tw-px-2xl tw-py-lg tw-bg-primary tw-grow-0 tw-shrink-0 tw-rounded-xl tw-border-secondary tw-border-solid tw-border"
        >
          <div className="tw-mb-3xl tw-rounded-md tw-bg-gray-300 tw-w-[200px] tw-h-[28px] tw-animate-pulse"></div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="tw-flex tw-flex-row">
              <div className="tw-w-[257px] tw-h-[87px] tw-rounded-md tw-bg-gray-300 tw-animate-pulse"></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
