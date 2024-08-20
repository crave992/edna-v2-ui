import AreaDto from '@/dtos/AreaDto';

export const fetchAreas = async (page: number, recordPerPage: number) => {
  const response = await fetch(`/api/areas?page=${page}&recordPerPage=${recordPerPage}`);
  const data = await response.json();

  return data;
};

export const fetchAreasByLevel = async (levelId: number) => {
  const response = await fetch(`/api/areas/level/${levelId}`);
  const data = await response.json();

  return data;
};

export const fetchAreasByLevelAndClass = async (levelId: number, classId: number) => {
  const response = await fetch(`/api/areas/level/${levelId}/${classId}`);
  const data = await response.json();

  return data;
};

export const fetchAreasByLevelAndClassAndStudent = async (levelId: number, classId: number, studentId: number) => {
  const response = await fetch(`/api/areas/level/${levelId}/${classId}/${studentId}`);
  const data = await response.json();

  return data;
};

export const fetchAreasForGuide = async () => {
  const response = await fetch(`/api/areas/guide`);
  const data = await response.json();

  return data;
};

export const fetchAreasByLevelAndStudent = async (levelId: number, studentId: number) => {
  const response = await fetch(`/api/areas/level/${levelId}/student/${studentId}`);
  const data = await response.json();

  return data;
};
