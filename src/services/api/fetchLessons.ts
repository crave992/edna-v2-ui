export const fetchLessonsByLevelAndClassAndStudent = async (
  levelId: number,
  classId: number,
  studentId: number
) => {
  const response = await fetch(`/api/lesson/${levelId}/${classId}/${studentId}`);
  const data = await response.json();

  return data;
};

export const fetchLessonsByLevelAndClass = async (levelId: number, classId: number) => {
  const response = await fetch(`/api/lesson/${levelId}/${classId}`);
  const data = await response.json();

  return data;
};

export const fetchLessonsByClass = async (classId: number) => {
  const response = await fetch(`/api/lesson/class/${classId}`);
  const data = await response.json();

  return data;
};

export const fetchLessonByLessonId = async (lessonId: number) => {
  const response = await fetch(`/api/lesson/get-lesson/${lessonId}`);
  const data = await response.json();

  return data;
};

export const fetchLessonsByLevelClassAreaTopic = async (
  levelId: number,
  classId: number,
  areaId?: number,
  topicId?: number
) => {
  const response = await fetch(`/api/lesson/level-class-area-topic/${levelId}/${classId}/${areaId}/${topicId}/`);
  const data = await response.json();

  return data;
};

export const fetchLessonsByLevelAreaTopic = async (levelId: number, areaId?: number, topicId?: number) => {
  const response = await fetch(`/api/lesson/level-area-topic/${levelId}/${areaId}/${topicId}/`);
  const data = await response.json();

  return data;
};

export const fetchLessonsByLevelClassArea = async (levelId: number, classId: number, areaId?: number) => {
  const response = await fetch(`/api/lesson/level-class-area-topic/${levelId}/${classId}/${areaId}`);
  const data = await response.json();

  return data;
};

export const fetchLessonsByLevel = async (levelId: number) => {
  const response = await fetch(`/api/lesson/${levelId}`);
  const data = await response.json();

  return data;
};
