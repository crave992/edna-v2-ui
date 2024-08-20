import router from "next/router";

interface QueryParams {
  q?: string;
  page?: number;
  recordPerPage?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  registration?: string;
  status?: string;
}

export const fetchParents = async ({ q, page = 1, recordPerPage, sortBy, sortDirection, registration, status }: QueryParams) => {
  const response = await fetch(
    `/api/parents?q=${q}&page=${page}&recordPerPage=${recordPerPage}&sortBy=${sortBy}&sortDirection=${sortDirection}&registration=${registration}&status=${status}`
  ).then((res) => res.json());
  return await response;
};

export const fetchParent = async (parentId: number | undefined) => {
  const response = await fetch(`/api/parent/${parentId}`);

  if(!response.ok && response.status == 403) {
    router.replace('/account/access-denied');
  }
  const data = await response.json();

  return data;
};

export const fetchParentCurrentUserInfo = async () => {
  const response = await fetch(`/api/parent/get-current`);
  const data = await response.json();

  return data;
};
