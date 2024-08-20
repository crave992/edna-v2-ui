import { fetchClass, fetchClassByStaff, fetchClassData, fetchClassesForAdmin } from '@/services/api/fetchClass';
import { useQuery } from '@tanstack/react-query';

interface ClassesQueryProps {
  isAdmin?: boolean;
  staffId?: number;
}

interface ClasssDirectoryQueryProps {
  q?: string;
  page?: number;
  recordPerPage?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  level?: string;
  semester?: string;
  status?: string;
}

export const useClassesQuery = ({ isAdmin, staffId }: ClassesQueryProps) =>
  useQuery({
    queryKey: ['classes'],
    queryFn: () => (isAdmin ? fetchClassesForAdmin({ pagination: false }) : fetchClassByStaff(staffId!)),
    enabled: !!staffId && isAdmin !== undefined,
    staleTime: Infinity,
  });
export const useClass = (classId: number) => {
  return useQuery({
    queryKey: ['classes', classId],
    queryFn: () => fetchClassData(classId),
    enabled: !!classId,
  });
};

export const useClassesDirectoryQuery = ({
  q,
  page,
  recordPerPage,
  sortBy,
  sortDirection,
  level,
  semester,
  status,
}: ClasssDirectoryQueryProps) =>
  useQuery({
    queryKey: [
      'classes-directory',
      {
        q,
        page,
        recordPerPage,
        sortBy,
        sortDirection,
        status,
        level,
        semester,
      },
    ],
    queryFn: () =>
      fetchClass({
        q,
        page,
        recordPerPage,
        sortBy,
        sortDirection,
        status,
        level,
        semester,
      }),
  });
