import { fetchUserSystemRoles } from '@/services/api/fetchUserSystemRoles';
import { useQuery } from '@tanstack/react-query';

export const useSystemUserRolesQuery = () =>
  useQuery({
    queryKey: ['system-roles'],
    queryFn: () => fetchUserSystemRoles(),
    staleTime: Infinity,
  });
