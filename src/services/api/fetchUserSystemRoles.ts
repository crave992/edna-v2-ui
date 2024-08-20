export const fetchUserSystemRoles = async () => {
  const response = await fetch(`/api/staff/filters/user-role`);
  const data = await response.json();
  return data;
};