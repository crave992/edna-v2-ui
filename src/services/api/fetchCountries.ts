export const fetchCountries = async () => {
  const response = await fetch(`/api/countries`);
  const data = await response.json();

  return data;
};
