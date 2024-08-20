export default interface ClassAttendanceAddUpdateModel {
  classId: number;
  attendanceDate: Date;
  classAttendances: ClassAttendanceModel[];
}
export interface ClassAttendanceModel {
  studentId: number;
  presentOrAbsent: string;
  isTardy: boolean | null;
}

export interface AttendanceModel {
  classId: number;
  studentId: number;
  attendanceDate: Date;
  time?: string;
  presentOrAbsent: string;
  note: string;
  isTardy?: boolean;
}

export interface ClassAttendanceUpdateModel {
  classId: number;
  studentId: number;
  attendanceDate: Date | null;
  presenceType: string;
  action: string;
  isTardy: boolean;
  note: string;
  time?: string;
}
