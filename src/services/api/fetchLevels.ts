export const fetchLevels = async () => {
  const response = await fetch('/api/staff/filters/level');
  return await response.json();
};

export const fetchAllLevels = async () => {
  const response = await fetch('/api/level');
  return await response.json();
};

export const fetchOnboardingLevels = async (code: string) => {
  const response = await fetch(`/api/onboarding/level/${code}`);
  return await response.json();
};
