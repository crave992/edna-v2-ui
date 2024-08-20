export const fetchStaffData = async (id: number) => {
  const response = await fetch(`/api/staff/${id}`);
  const data = await response.json();

  return data;
};
