import { StaffBasicDto } from "./StaffDto";

export default interface ClassAttendanceDto {
    id: number;
    studentId: number;
    classId: number;
    studentName: string;
    studentNickName: string;
    presentOrAbsent: string;
    attendanceDate: Date;
    isTardy: boolean | null;
    studentProfilePicture: string;
}

export interface ClassAttendanceReportsDto {
    id: number;
    attendanceDate: Date;
    classId: number;
    studentId: number;
    className: string;
    studentName: string;
    excuseAbsent: number | null;
    present: number | null;
    unexcusedAbsent: number | null;
    isTardy: number | null;
    staffs: StaffBasicDto[];
}

export interface ClassAttendanceReportsListResponseDto {
    totalRecord: number;
    reports: ClassAttendanceReportsDto[];
}