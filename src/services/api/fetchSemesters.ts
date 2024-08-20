export const fetchSemesters = async () => {
  const response = await fetch(`/api/semesters`);
  const data = await response.json();

  return data;
};
