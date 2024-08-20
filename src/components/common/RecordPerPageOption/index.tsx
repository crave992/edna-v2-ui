import RecordPerPageData from "@/data/RecordPerPageData";

const RecordPerPageOption = () => {
  return (
    <>
      {RecordPerPageData.map((page) => {
        return (
          <option key={page.value} value={page.value}>
            {page.label}
          </option>
        );
      })}
    </>
  );
};

export default RecordPerPageOption;
