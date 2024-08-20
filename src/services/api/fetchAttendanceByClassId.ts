export const fetchAttendanceByClassId = async (classId: number) => {
  const response = await fetch(`/api/attendance/class/${classId}`);
  const data = await response.json();

  return data;
};
