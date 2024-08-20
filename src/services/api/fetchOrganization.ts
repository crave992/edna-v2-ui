export const fetchOrganizations = async () => {
  const response = await fetch(`/api/organization`);
  const data = await response.json();
  
  return data;
};

export const fetchOrganization = async (id: number) => {
  const response = await fetch(`/api/organization/${id}`);
  const data = await response.json();
  
  return data;
};