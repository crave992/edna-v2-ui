import { StaffType } from './ClassDto';

export default interface ClassAssignmentDto {
  id: number;
  studentId: number;
  classId: number;
  levelId: number;
  className: string;
  fromDate: Date;
  toDate: Date | null;
  levelName: string;
  type: StaffType;
}
