import router from 'next/router';

interface QueryParams {
  q?: string;
  page?: number;
  recordPerPage?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  levels?: string;
  ages?: string;
  status?: string;
  classes?: string;
  studentId?: number;
  lessonId?: number;
  classId?: number;
}

export const fetchStudents = async ({
  q,
  page = 1,
  recordPerPage,
  sortBy,
  sortDirection,
  levels,
  ages,
  status,
  classes,
}: QueryParams) => {
  const response = await fetch(
    `/api/students?q=${q}&page=${page}&recordPerPage=${recordPerPage}&sortBy=${sortBy}&sortDirection=${sortDirection}&levels=${levels}&status=${status}&ages=${ages}&classes=${classes}`
  ).then((res) => res.json());

  const data = await response;
  return data;
};

export const fetchStudentMilestones = async ({
  q,
  page = 1,
  recordPerPage,
  sortBy,
  sortDirection,
  studentId,
  classId,
}: QueryParams) => {
  const response = await fetch(
    `/api/students/milestones?q=${q}&page=${page}&recordPerPage=${recordPerPage}&sortBy=${sortBy}&sortDirection=${sortDirection}${
      classId ? `&ClassId=${classId}&` : '&'
    }${studentId ? `StudentId=${studentId}` : ''}`
  ).then((res) => res.json());

  const data = await response;
  return data;
};

export const fetchStudentsForAdding = async ({ page = 1, recordPerPage, sortDirection, status }: QueryParams) => {
  const response = await fetch(
    `/api/students?page=${page}&recordPerPage=${recordPerPage}&sortDirection=${sortDirection}&status=${status}`
  ).then((res) => res.json());

  const data = await response;
  return data;
};

export const fetchStudentsByClass = async (classId: number) => {
  const response = await fetch(`/api/students/class/${classId}`);
  const data = await response.json();

  return data;
};

export const fetchStudent = async (studentId: number | undefined) => {
  const response = await fetch(`/api/student/${studentId}`);

  if (!response.ok && response.status == 403) {
    router.replace('/account/access-denied');
  }

  const data = await response.json();
  return data;
};

export const fetchClassByStudent = async (studentId: number | undefined) => {
  const response = await fetch(`/api/student/${studentId}/class`);
  const data = await response.json();

  return data;
};

export const fetchStudentInputFormByStudent = async (studentId: number | undefined) => {
  const response = await fetch(`/api/student/${studentId}/student-input-form`);
  const data = await response.json();

  return data;
};

export const fetchStudentQuestionsByFormType = async (studentId: number | undefined, formType: string) => {
  const response = await fetch(`/api/student/${studentId}/forms/${formType}`);
  const data = await response.json();

  return data;
};

export const fetchAttendanceByStudentId = async (
  studentId: number,
  sortBy?: string,
  sortDirection?: 'asc' | 'desc'
) => {
  let keySortBy = sortBy === 'presentOrAbsent' ? 'status' : sortBy === 'attendanceDate' ? 'date' : sortBy;
  const response = await fetch(
    `/api/attendance/student/${studentId}?sortBy=${keySortBy}&sortDirection=${sortDirection}`
  );
  const data = await response.json();

  return data;
};

export const fetchStudentsByParent = async (parentId: number) => {
  const response = await fetch(`/api/students/parent/${parentId}`);
  const data = await response.json();

  return data;
};
