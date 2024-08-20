export const fetchEthnicity = async (categoryId: number | undefined) => {
  const response = await fetch(`/api/race/${categoryId}`);
  const data = await response.json();

  return data;
};
