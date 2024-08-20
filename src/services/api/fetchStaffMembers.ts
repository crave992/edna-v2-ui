interface QueryParams {
  q?: string;
  page?: number;
  recordPerPage?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  level?: string;
  salaryType?: string;
  status?: string;
  role?: string;
}

export const fetchStaffMembers = async ({
  q,
  page = 1,
  recordPerPage,
  sortBy,
  sortDirection,
  level,
  salaryType,
  status,
  role,
}: QueryParams) => {
  const urlParams = `?q=${q}&page=${page}&recordPerPage=${recordPerPage}&sortBy=${sortBy}&sortDirection=${sortDirection}&level=${level}&status=${status}&salaryType=${salaryType}&role=${role}`;
  const response = await fetch(`/api/staff${urlParams}`);
  const data = await response.json();

  return data;
};
