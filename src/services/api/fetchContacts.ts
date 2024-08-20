interface QueryParams {
  q?: string;
  page?: number;
  recordPerPage?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  staffId?: number;
  studentId?: number;
}

export const fetchContacts = async ({ q, page = 1, recordPerPage, sortBy, sortDirection, staffId }: QueryParams) => {
  const urlParams = `?q=${q}&page=${page}&recordPerPage=${recordPerPage}&sortBy=${sortBy}&sortDirection=${sortDirection}&staffId=${staffId}`;
  const response = await fetch(`/api/contacts/${urlParams}`);
  const data = await response.json();

  return data;
};

export const fetchStudentContacts = async ({ q, page = 1, recordPerPage, sortBy, sortDirection, studentId }: QueryParams) => {
  const urlParams = `?q=${q}&page=${page}&recordPerPage=${recordPerPage}&sortBy=${sortBy}&sortDirection=${sortDirection}&studentId=${studentId}`;
  const response = await fetch(`/api/contacts/${urlParams}`);
  const data = await response.json();

  return data;
};
