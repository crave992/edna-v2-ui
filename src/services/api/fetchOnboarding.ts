export const fetchParentOnboarding = async (code: string) => {
  const encodedString = encodeURIComponent(String(code));
  const response = await fetch(`/api/onboarding/parent?code=${encodedString}`);
  const data = await response.json();

  return data;
};

export const fetchOrganizationOnboarding = async (code: string) => {
  const encodedString = encodeURIComponent(String(code));
  const response = await fetch(`/api/onboarding/organization?code=${encodedString}`);
  const data = await response.json();

  return data;
};

export const fetchStudentOnboarding = async (code: string, studentId: number) => {
  const encodedString = encodeURIComponent(String(code));
  const response = await fetch(`/api/onboarding/student/${studentId}?code=${encodedString}`);
  const data = await response.json();

  return data;
};

export const fetchOnboardingStudentQuestionsByFormType = async (
  code: string,
  studentId: number | undefined,
  formType: string
) => {
  const encodedString = encodeURIComponent(String(code));
  const response = await fetch(`/api/onboarding/student/${studentId}/forms/${formType}?code=${encodedString}`);
  const data = await response.json();

  return data;
};

export const fetchOnboardingLevels  = async (
  code: string,
) => {
  const encodedString = encodeURIComponent(String(code));
  const response = await fetch(`/api/onboarding/level?code=${encodedString}`);
  const data = await response.json();

  return data;
};

export const fetchOnboardingProgramOptionsByLevel = async (
  code: string,
  levelId: number | undefined,
) => {
  const encodedString = encodeURIComponent(String(code));
  const response = await fetch(`/api/onboarding/program-options/${levelId}?code=${encodedString}`);
  const data = await response.json();

  return data;
};
