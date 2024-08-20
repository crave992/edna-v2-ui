import ClassAttendanceDto from "@/dtos/ClassAttendanceDto";

export const getInitials = (firstName: string | undefined, lastName: string | undefined): string => {
  const trimmedFirstName = firstName?.trim() ?? '';
  const trimmedLastName = lastName?.trim() ?? '';

  const initialFirstName = trimmedFirstName.charAt(0).toUpperCase();
  const initialLastName = trimmedLastName.charAt(0).toUpperCase();

  return initialFirstName + initialLastName;
};

export const getStudentName = (attendant: ClassAttendanceDto) => {
  const student = attendant.studentName.trim().split(/\s+/);
  return `${student[0]} ${student[1] && student[1].charAt(0) + '.'}`;
};