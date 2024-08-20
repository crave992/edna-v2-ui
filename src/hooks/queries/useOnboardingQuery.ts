import {
  fetchOnboardingStudentQuestionsByFormType,
  fetchOrganizationOnboarding,
  fetchParentOnboarding,
  fetchStudentOnboarding,
} from '@/services/api/fetchOnboarding';
import { useQuery } from '@tanstack/react-query';

interface OnboardingQueryProps {
  code: string;
  level?: number;
  studentId?: number;
  inputFormType?: string;
}

export const useOnboardingParentQuery = ({ code }: OnboardingQueryProps) =>
  useQuery({
    queryKey: ['onboarding-parent', code],
    queryFn: () => fetchParentOnboarding(code),
    enabled: !!code,
  });

export const useOnboardingOrgQuery = ({ code }: OnboardingQueryProps) =>
  useQuery({
    queryKey: ['onboarding-organization', code],
    queryFn: () => fetchOrganizationOnboarding(code),
    enabled: !!code,
  });

export const useOnboardingStudentQuery = ({ code, studentId }: OnboardingQueryProps) =>
  useQuery({
    queryKey: ['onboarding-student', code, studentId],
    queryFn: () => fetchStudentOnboarding(code!, studentId!),
    enabled: !!code && !!studentId,
  });

export const useOnboardingStudentInputFormQuery = ({ code, studentId, inputFormType }: OnboardingQueryProps) =>
  useQuery({
    queryKey: ['onboarding-student-questions-inputform', studentId, inputFormType],
    queryFn: () => fetchOnboardingStudentQuestionsByFormType(code!, studentId, inputFormType!),
    enabled: !!code && !!studentId && !!inputFormType,
  });
