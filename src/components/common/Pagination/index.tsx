import React from "react";
import { DOTS, usePagination } from "../../../hooks/usePagination";
import classnames from "classnames";
import { Col } from "react-bootstrap";

const Pagination = (props: any) => {
  const {
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
  }: {
    onPageChange: (page: number) => void;
    totalCount: number;
    siblingCount: number;
    currentPage: number;
    pageSize: number;
    className: string;
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (
    currentPage === 0 ||
    !paginationRange ||
    (paginationRange.length < 2 && pageSize >= totalCount)
  ) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  let startNumber: number = (currentPage - 1) * pageSize + 1;
  let endNumber: number = Number(startNumber - 1) + Number(pageSize);
  endNumber = endNumber > totalCount ? totalCount : endNumber;

  const showingText = `Showing ${startNumber} to ${endNumber} of ${totalCount} enteries`;
  return (
    <>
      <div className="tablePagination">
        <Col>
          <p className="tablePaginationDetails">{showingText}</p>
        </Col>
        <Col>
          <ul
            className={classnames("pagination-container", {
              [className]: className,
            })}
          >
            <li
              className={classnames("pagination-item", {
                disabled: currentPage === 1,
              })}
              onClick={onPrevious}
            >
              <div className="arrow left" />
            </li>
            {paginationRange.map((pageNumber) => {
              if (pageNumber === DOTS) {
                return (
                  <li key={Math.random()} className="pagination-item dots">
                    &#8230;
                  </li>
                );
              }

              return (
                <li
                  className={classnames("pagination-item", {
                    selected: pageNumber === currentPage,
                  })}
                  onClick={() => onPageChange(pageNumber as number)}
                  key={Math.random()}
                >
                  {pageNumber}
                </li>
              );
            })}
            <li
              className={classnames("pagination-item", {
                disabled: currentPage === lastPage,
              })}
              onClick={onNext}
            >
              <div className="arrow right" />
            </li>
          </ul>
        </Col>
      </div>
    </>
  );
};

export default Pagination;
