import ClassDto from '@/dtos/ClassDto';

interface QueryParams {
  q?: string;
  page?: number;
  recordPerPage?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  level?: string;
  semester?: string;
  status?:string;
  pagination?: boolean;
}

export const fetchClass = async ({
  q,
  page = 1,
  recordPerPage,
  sortBy,
  sortDirection,
  level,
  semester,
  status,
  pagination = true,
}: QueryParams) => {
  let urlParams = `?recordPerPage=1000`;
  if (pagination)
    urlParams = `?q=${q}&page=${page}&recordPerPage=${recordPerPage}&sortBy=${sortBy}&sortDirection=${sortDirection}&level=${level}&semester=${semester}&status=${status}`;
  const response = await fetch(`/api/class${urlParams}`);
  const data = await response.json();

  return data;
};

export const fetchClassData = async (id: number): Promise<ClassDto> => {
  const response = await fetch(`/api/class/${id}`);
  const data = await response.json();

  return data;
};

export const fetchClassByStaff = async (staffId: number) => {
  const response = await fetch(`/api/class/staff/${staffId}`);
  const data = await response.json();

  return data;
};

export const fetchClassesForAdmin = async ({
  q,
  page = 1,
  recordPerPage,
  sortBy,
  sortDirection,
  level,
  semester,
  pagination = true,
}: QueryParams) => {
  let urlParams = `?recordPerPage=1000`;
  if (pagination)
    urlParams = `?q=${q}&page=${page}&recordPerPage=${recordPerPage}&sortBy=${sortBy}&sortDirection=${sortDirection}&level=${level}&semester=${semester}`;
  const response = await fetch(`/api/class${urlParams}`);
  const data = await response.json();

  if (data && data.classes && data.classes.length > 0) {
    return data.classes;
  }

  return data;
};
