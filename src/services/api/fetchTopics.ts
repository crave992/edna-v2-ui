export const fetchTopicsByLevel = async (levelId: number) => {
  const response = await fetch(`/api/topics/level/${levelId}`);
  const data = await response.json();
  
  return data;
};

export const fetchTopicsByLevelAndArea = async (levelId: number, areaId: number) => {
  const response = await fetch(`/api/topics/level/${levelId}/${areaId}`);
  const data = await response.json();
  
  return data;
};