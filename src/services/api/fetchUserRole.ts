export const fetchUserRole = async () => {
  const response = await fetch(`/api/user-role`);
  const data = await response.json();
  
  return data;
};