export const fetchStates = async () => {
  const response = await fetch(`/api/states`);
  const data = await response.json();

  return data;
};

export const fetchStatesByCountry = async (countryId: number | undefined) => {
  const response = await fetch(`/api/states/country/${countryId}`);
  const data = await response.json();

  return data;
};
