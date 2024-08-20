export const fetchClassForGuideDashboard = async () => {
  const response = await fetch(`/api/guides/dashboard`);
  const data = await response.json();
  
  return data;
};

export const fetchClassForGuide = async () => {
  try {
    const response = await fetch(`/api/guides/dashboard`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error("Error fetching class for guide:", error);
    return null;
  }
};