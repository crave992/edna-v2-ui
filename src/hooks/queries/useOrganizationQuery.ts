import { fetchOrganization, fetchOrganizations } from '@/services/api/fetchOrganization';
import { useQuery } from '@tanstack/react-query';

export const useOrganizationsQuery = () =>
  useQuery({
    queryKey: ['organizations'],
    queryFn: () => fetchOrganizations(),
    staleTime: Infinity,
  });

export const useOrganizationQuery = (orgId: number) =>
  useQuery({
    queryKey: ['organizations', orgId],
    queryFn: () => fetchOrganization(orgId),
    staleTime: Infinity,
    enabled: !!orgId,
  });
