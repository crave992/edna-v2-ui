import CommonProps from "@/models/CommonProps";
import { faAngleDown, faAngleUp } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";

interface SortingProps extends CommonProps {
  sortingColumn: string;
  currentSortingColumn: string;
  currentSortDirection: string;
  sortData: (sortingColumn: string, sortDirection: string) => void
}

const Sorting: NextPage<SortingProps> = (props) => {

  function activateSorting(sortingColumn: string, sortDirection: string) {
    return sortingColumn === props.currentSortingColumn && sortDirection === props.currentSortDirection ? "active" : "";
  }
  

  return (
    <>
      <span className="sorting_btn">

        {props.currentSortDirection === "asc" && 
        <span
          className={`sorting ${activateSorting(props.sortingColumn, "asc")}`}
          onClick={() => {
              props.sortData(props.sortingColumn, "desc");
          }}
        >
          <FontAwesomeIcon icon={faAngleUp} size="1x" />
        </span> }

        {props.currentSortDirection === "desc" && 
        <span
          className={`sorting ${activateSorting(props.sortingColumn, "desc")}`}
          onClick={() => {
              props.sortData(props.sortingColumn, "asc");
          }}
        >
          <FontAwesomeIcon icon={faAngleDown} size="1x" />
        </span> }
      </span>
    </>
  );
};

export default Sorting;
