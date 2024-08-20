export const fetchRace = async () => {
  const response = await fetch(`/api/race`);
  const data = await response.json();

  return data;
};
