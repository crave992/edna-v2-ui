export default interface ClassAttendanceOverViewDto {
    classId: number;
    className: string;
    presentOrAbsent: string;
    totalStudent: number | null;
    totalPresent: number | null;
    totalAbsent: number | null;
}