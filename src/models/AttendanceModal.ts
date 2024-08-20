export default interface AttendanceModal {
    classId: number;
    attendanceDate: Date;
}

export interface ClassAttendanceMakeModel {
    classId: number;
    studentId: number;
    attendanceDate: string;
    presenceType: string;
    action: string;
    isTardy: boolean;
}