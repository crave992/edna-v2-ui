export const fetchAdminDashboardCount = async () => {
  const response = await fetch(`/api/admin/dashboard-count`);
  const data = await response.json();

  return data;
};

export const fetchAdminDashboardGallery = async () => {
  const response = await fetch(`/api/admin/dashboard-gallery`);
  const data = await response.json();

  return data;
};

export const fetchAdminDashboardAttendance = async (type: number) => {
  const response = await fetch(`/api/admin/attendance?type=${type}`);
  const data = await response.json();

  return data;
};

export const fetchMilestones = async () => {
  const response = await fetch(`/api/admin/milestones`);
  const data = await response.json();

  return data;
};

export const fetchPopularLessons = async () => {
  const response = await fetch(`/api/admin/popular-lessons`);
  const data = await response.json();

  return data;
};

export const fetchPopularAreas = async () => {
  const response = await fetch(`/api/admin/popular-areas`);
  const data = await response.json();

  return data;
};


export const fetchUpcomingBirthdays = async () => {
  const response = await fetch(`/api/admin/upcoming-birthdays`);
  const data = await response.json();

  return data;
};

export const fetchStatistics = async () => {
  const response = await fetch(`/api/admin/statistics`);
  const data = await response.json();

  return data;
};
