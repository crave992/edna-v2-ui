import { StudentDto } from '@/dtos/StudentDto';
import { fetchStudentContacts } from '@/services/api/fetchContacts';
import {
  fetchClassByStudent,
  fetchStudent,
  fetchStudentMilestones,
  fetchStudentQuestionsByFormType,
  fetchStudents,
  fetchStudentsByClass,
  fetchStudentsForAdding,
} from '@/services/api/fetchStudents';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface StudentsQueryProps {
  classId?: number;
}

interface StudentsDirectoryQueryProps {
  q?: string;
  page?: number;
  recordPerPage?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  levels?: string;
  ages?: string;
  status?: string;
  classes?: string;
  studentId?: number;
  classId?: number;
}

interface StudentContactsQueryProps {
  studentId?: number;
}

interface StudentInputFormQueryProps {
  studentId?: number;
  type?: string;
}

export const useClassStudentsQuery = ({ classId }: StudentsQueryProps) =>
  useQuery({
    queryKey: ['students', { class: classId }],
    queryFn: () => fetchStudentsByClass(classId!),
    enabled: !!classId,
  });

export const useStudentsQuery = () =>
  useQuery({
    queryKey: ['students'],
    queryFn: () =>
      fetchStudentsForAdding({
        page: 1,
        sortDirection: 'asc',
        recordPerPage: 10000,
        status: 'active',
      }),
  });

export const useStudentQuery = (studentId: number) => {
  return useQuery({
    queryKey: ['students', studentId],
    queryFn: () => fetchStudent(studentId),
    enabled: !!studentId,
  });
};

export const useStudentContactQuery = ({ studentId }: StudentContactsQueryProps) =>
  useQuery({
    queryKey: ['student-contacts', { student: studentId }],
    queryFn: () =>
      fetchStudentContacts({
        q: '',
        page: 1,
        recordPerPage: 1000,
        sortBy: '',
        sortDirection: 'asc',
        studentId,
      }),
    enabled: !!studentId,
  });

export const useStudentsDirectoryQuery = ({
  q,
  page,
  recordPerPage,
  sortBy,
  sortDirection,
  levels,
  ages,
  status,
  classes,
}: StudentsDirectoryQueryProps) =>
  useQuery({
    queryKey: [
      'students-directory',
      {
        q,
        page,
        recordPerPage,
        sortBy,
        sortDirection,
        levels,
        ages,
        status,
        classes,
      },
    ],
    queryFn: () =>
      fetchStudents({
        q,
        page,
        recordPerPage,
        sortBy,
        sortDirection,
        levels,
        ages,
        status,
        classes,
      }),
    staleTime: Infinity,
  });

export const useStudentDirectoryQuery = (studentId: number) =>
  useQuery({
    queryKey: ['students-directory', studentId],
    queryFn: () => fetchStudent(studentId),
    enabled: !!studentId,
  });

export const useStudentClassDirectoryQuery = (studentId: number) =>
  useQuery({
    queryKey: ['classes-directory', { student: studentId }],
    queryFn: () => fetchClassByStudent(studentId),
    enabled: !!studentId,
  });

export const useStudentInputForm = ({ studentId, type }: StudentInputFormQueryProps) =>
  useQuery({
    queryKey: ['students-directory', studentId, 'input-form', { type }],
    queryFn: () => fetchStudentQuestionsByFormType(studentId, type!),
  });

export const useStudentMilestoneStudentQuery = ({
  q,
  page,
  recordPerPage,
  sortBy,
  sortDirection,
  studentId,
}: StudentsDirectoryQueryProps) => {
  return useQuery({
    queryKey: ['students-directory', 'milestones', { student: studentId }],
    queryFn: () =>
      fetchStudentMilestones({
        q,
        page,
        recordPerPage,
        sortBy,
        sortDirection,
        studentId,
      }),
  });
};

export const useStudentMilestoneClassQuery = ({
  q,
  page,
  recordPerPage,
  sortBy,
  sortDirection,
  classId,
}: StudentsDirectoryQueryProps) => {
  return useQuery({
    queryKey: ['students-directory', 'milestones', { class: classId }],
    queryFn: () =>
      fetchStudentMilestones({
        q,
        page,
        recordPerPage,
        sortBy,
        sortDirection,
        classId,
      }),
  });
};
