export const fetchProgramOptions = async () => {
  const response = await fetch(`/api/program-option`);
  const data = await response.json();
  
  return data;
};

export const fetchProgramOptionsByLevel = async (levelId: number | undefined) => {
  const response = await fetch(`/api/program-option/${levelId}`);
  const data = await response.json();
  
  return data;
};