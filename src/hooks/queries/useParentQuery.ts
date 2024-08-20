import { fetchParent, fetchParentCurrentUserInfo, fetchParents } from '@/services/api/fetchParents';
import { useQuery } from '@tanstack/react-query';

interface ParentsDirectoryQueryProps {
  q: string;
  page: number;
  recordPerPage: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  registration: string;
  status: string;
}

export const useParentQuery = (isParent: boolean) =>
  useQuery({
    queryKey: ['parent-current-user'],
    queryFn: fetchParentCurrentUserInfo,
    enabled: !!isParent,
  });

export const useParentsDirectoryQuery = ({
  q,
  page,
  recordPerPage,
  sortBy,
  sortDirection,
  registration,
  status,
}: ParentsDirectoryQueryProps) =>
  useQuery({
    queryKey: [
      'parents-directory',
      {
        q,
        page,
        recordPerPage,
        sortBy,
        sortDirection,
        registration,
        status,
      },
    ],
    queryFn: () =>
      fetchParents({
        q,
        page,
        recordPerPage,
        sortBy,
        sortDirection,
        registration,
        status,
      }),
  });

export const useParentDirectoryQuery = (parentId: number) =>
  useQuery({
    queryKey: ['parents-directory', parentId],
    queryFn: () => fetchParent(parentId),
    enabled: !!parentId,
  });
