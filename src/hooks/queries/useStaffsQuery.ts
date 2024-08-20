import StaffDto from '@/dtos/StaffDto';
import { fetchContacts } from '@/services/api/fetchContacts';
import { fetchStaffData } from '@/services/api/fetchStaffData';
import { fetchStaffMembers } from '@/services/api/fetchStaffMembers';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface StaffsQueryProps {
  staffId?: number;
}

interface StaffsDirectoryQueryProps {
  q: string;
  page: number;
  recordPerPage: number;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  level?: string;
  salaryType?: string;
  status?: string;
  role?: string;
  staffId?: number;
}

export const useStaffsQuery = () =>
  useQuery({
    queryKey: ['staffs'],
    queryFn: () =>
      fetchStaffMembers({
        q: '',
        page: 1,
        sortBy: '',
        sortDirection: 'asc',
        recordPerPage: 1000,
        level: '',
        salaryType: '',
        status: '',
        role: 'Teacher',
      }),
    staleTime: Infinity,
  });

export const useStaffQuery = ({ staffId }: StaffsQueryProps) =>
  useQuery({
    queryKey: ['staffs', staffId],
    queryFn: () => fetchStaffData(staffId!),
    staleTime: Infinity,
    enabled: !!staffId,
  });

export const useStaffsDirectoryQuery = ({
  q,
  page,
  recordPerPage,
  sortBy,
  sortDirection,
  level,
  salaryType,
  status,
  role,
}: StaffsDirectoryQueryProps) =>
  useQuery({
    queryKey: [
      'staffs-directory',
      {
        q,
        page,
        recordPerPage,
        sortBy,
        sortDirection,
        level,
        salaryType,
        status,
        role,
      },
    ],
    queryFn: () =>
      fetchStaffMembers({
        q,
        page,
        recordPerPage,
        sortBy,
        sortDirection,
        level,
        salaryType,
        status,
        role,
      }),
  });

export const useStaffDirectoryQuery = (staffId: number) => {
  return useQuery({
    queryKey: ['staffs-directory', staffId],
    queryFn: () => fetchStaffData(staffId),
    enabled: !!staffId,
  });
};

export const useStaffContactsyQuery = ({
  q,
  page,
  recordPerPage,
  sortBy,
  sortDirection,
  staffId,
}: StaffsDirectoryQueryProps) =>
  useQuery({
    queryKey: ['staff-contacts', { q, page, recordPerPage, sortBy, sortDirection, staffId }],
    queryFn: () =>
      fetchContacts({
        q,
        page: page,
        recordPerPage,
        sortBy,
        sortDirection,
        staffId,
      }),
  });
