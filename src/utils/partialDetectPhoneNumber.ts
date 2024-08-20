export const checkPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) return false;

  const firstChar = phoneNumber.trim()[0];
  return !isNaN(parseInt(firstChar)) || firstChar === '+';
};
