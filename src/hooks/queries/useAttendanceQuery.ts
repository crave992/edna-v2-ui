import { fetchAdminDashboardAttendance } from '@/services/api/fetchAdminQueries';
import { fetchAttendanceByClassId } from '@/services/api/fetchAttendanceByClassId';
import { fetchAttendanceByStudentId } from '@/services/api/fetchStudents';
import { useQuery } from '@tanstack/react-query';

interface AttendanceQueryProps {
  classId?: number;
  studentId?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export const useClassAttendanceQuery = ({ classId }: AttendanceQueryProps) =>
  useQuery({
    queryKey: ['attendance', { class: classId }],
    queryFn: () => fetchAttendanceByClassId(classId!),
    enabled: !!classId,
  });

export const useStudentAttendanceQuery = ({ studentId, sortBy, sortDirection }: AttendanceQueryProps) =>
  useQuery({
    queryKey: ['attendance', { student: studentId, sortBy, sortDirection }],
    queryFn: () => fetchAttendanceByStudentId(studentId!, sortBy, sortDirection),
    enabled: !!studentId,
  });

export const useAttendanceQuery = (type: number) => {
  let filter = null;
  
  if (type == 0) {
    filter = { type: 'daily' };
  } else if (type == 1) {
    filter = { type: 'monthly' };
  }

  return useQuery({
    queryKey: ['attendance', filter],
    queryFn: () => fetchAdminDashboardAttendance(type),
    enabled: !!filter
  });
};
