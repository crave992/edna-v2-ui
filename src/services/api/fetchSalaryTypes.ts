export const fetchSalaryTypes = async () => {
  const response = await fetch(`/api/staff/filters/salary-type`);
  const data = await response.json();
  
  return data;
};