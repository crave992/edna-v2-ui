export interface StudentAttendanceDto {
  classAttendanceId: number;
  studentId: number;
  studentName: string;
  classId: number;
  className: string;
  presentOrAbsent: string;
  attendanceDate: string;
  isTardy: boolean | null;
}
