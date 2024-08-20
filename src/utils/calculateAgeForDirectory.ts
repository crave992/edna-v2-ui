export const calculateAgeForDirectory = (dateOfBirth: string): string => {
  const birthDate = new Date(dateOfBirth);
  const currentDate = new Date();

  let years = currentDate.getFullYear() - birthDate.getFullYear();
  let months = currentDate.getMonth() - birthDate.getMonth();
  let days = currentDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0 || (months === 0 && days < 0)) {
    years--;
    months = (months + 12) % 12;
  }

  if (years > 0 && months === 0) {
    return `${years} Year${years !== 1 ? 's' : ''}`;
  }

  if (years === 0 && months === 0) {
    return `${days} day${days !== 1 ? 's' : ''}`;
  }

  if (years === 0) {
    return `${months} Month${months !== 1 ? 's' : ''}`;
  }

  return `${years} Year${years !== 1 ? 's' : ''} ${months} Month${months !== 1 ? 's' : ''}`;
};
