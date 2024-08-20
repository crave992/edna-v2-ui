export const fetchJobTitles = async () => {
  const response = await fetch(`/api/staff/filters/job-title`);
  const data = await response.json();
  
  return data;
};