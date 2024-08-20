import ArrowLeftIcon from '@/components/svg/ArrowLeft';
import ArrowRightIcon from '@/components/svg/ArrowRight';
import React from 'react';
import { Container } from 'react-bootstrap';

interface PaginationProps {
  page: number;
  setPage: (updateFn: (oldPage: number) => number) => void;
  totalPages: number;
  hasMoreData: boolean;
  isPreviousData: boolean;
}

const DirectoryPagination: React.FC<PaginationProps> = ({ page, setPage, totalPages, hasMoreData, isPreviousData }) => {
  const getImageStyle = (isDisabled: boolean) => ({
    filter: isDisabled ? 'grayscale(100%)' : 'none',
    opacity: isDisabled ? 0.5 : 1,
  });
  
  const getPaginationItems = () => {
    let items = [];
    let ellipsis = <div key="ellipsis" className="tw-flex tw-items-center tw-px-2">...</div>;

    if (totalPages <= 6) {
      for (let number = 1; number <= totalPages; number++) {
        items.push(renderPageButton(number));
      }
    } else {
      if (page < 4) {
        for (let number = 1; number <= 3; number++) {
          items.push(renderPageButton(number));
        }
        items.push(ellipsis);
        for (let number = totalPages - 2; number <= totalPages; number++) {
          items.push(renderPageButton(number));
        }
      } else if (page > totalPages - 3) {
        for (let number = 1; number <= 3; number++) {
          items.push(renderPageButton(number));
        }
        items.push(ellipsis);
        for (let number = totalPages - 2; number <= totalPages; number++) {
          items.push(renderPageButton(number));
        }
      } else {
        items.push(renderPageButton(1));
        items.push(ellipsis);
        for (let number = page - 1; number <= page + 1; number++) {
          items.push(renderPageButton(number));
        }
        items.push(ellipsis);
        items.push(renderPageButton(totalPages));
      }
    }

    return items;
  };

  const renderPageButton = (number: number) => {
    return (
      <button
        key={number}
        disabled={page === number}
        onClick={() => setPage(() => number)}
        className={`tw-border-none tw-bg-transparent tw-p-md tw-h-[40px] tw-w-[40px] tw-rounded-full tw-space-x-xss ${
          page === number
            ? 'tw-text-sm-medium tw-text-secondary-hover  tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center'
            : 'tw-text-sm-medium tw-text-tertiary hover:tw-bg-active hover:tw-ring-xs hover:tw-ring-[#98A2B314] hover:tw-ring-inset'
        }`}
        style={{ background: page == number ? '#F9FAFB' : undefined }}
      >
        {number}
      </button>
    );
  };

  return (
    <div className="tw-mx-4xl">
      {totalPages !== 0 && (
        <div className="tw-flex tw-items-center tw-py-lg tw-justify-between">
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1 || isPreviousData}
            className="tw-flex tw-items-center tw-justify-between tw-text-sm-semibold tw-text-secondary tw-rounded-md tw-bg-white tw-h-[36px] tw-border tw-border-button-secondary tw-border-solid hover:tw-bg-button-secondary-hover"
          >
            <div
              className="tw-flex tw-space-x-xs tw-py-md tw-px-lg"
              style={getImageStyle(page === 1 || isPreviousData)}
            >
              <ArrowLeftIcon />
              <div>Previous</div>
            </div>
          </button>
          <div className="tw-flex tw-justify-center tw-grow">{getPaginationItems()}</div>
          <button
            onClick={() => {
              if (!isPreviousData && hasMoreData) {
                setPage((old) => Math.min(old + 1, totalPages));
              }
            }}
            disabled={page === totalPages || isPreviousData || !hasMoreData}
            className="tw-flex tw-items-center tw-justify-between tw-text-sm-semibold tw-text-secondary tw-rounded-md tw-bg-white tw-h-[36px] tw-border tw-border-button-secondary tw-border-solid hover:tw-bg-button-secondary-hover"
          >
            <div
              className="tw-flex tw-space-x-xs tw-py-md tw-px-lg tw-space-x-xs"
              style={getImageStyle(isPreviousData || !hasMoreData)}
            >
              <div>Next</div>
              <ArrowRightIcon />
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default DirectoryPagination;
