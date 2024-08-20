export default function TopicLessonSkeleton() {
  return (
    <div className="skeleton tw-flex tw-flex-row tw-p-[8px] tw-bg-white">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="tw-flex tw-flex-col">
          {/* <div className="tw-rounded-md tw-bg-gray-300 tw-h-[37px] tw-w-[672px] tw-animate-pulse"></div> */}
          <div className="tw-flex tw-flex-row">
            {[...Array(10)].map((_, subIndex) => (
              <div key={`${index}-${subIndex}`} className="tw-mr-[8px]">
                <div className="tw-rounded-md tw-bg-gray-300 tw-h-[60px] tw-w-[170px] tw-animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
