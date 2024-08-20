import { ParentBasicDto } from "./ParentDto";
import { StaffBasicDto } from "./StaffDto";
import { StudentBasicDto } from "./StudentDto";

export default interface DirectoryListResponseDto {
    totalRecord: number;
    staff: StaffBasicDto[];
    parent: ParentBasicDto[];
    student: StudentBasicDto[];
}
