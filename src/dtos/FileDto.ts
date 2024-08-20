import { ParentBasicDto } from './ParentDto';
import { StaffBasicDto } from './StaffDto';
import { StudentBasicDto } from './StudentDto';

export default interface FileDto {
  id: number;
  studentId?: number;
  student?: StudentBasicDto;
  staffId?: number;
  staff?: StaffBasicDto;
  parentId?: number;
  parent?: ParentBasicDto;
  fileUrl?: string;
  createdOn: Date;
  createdBy: number;
  fileName: string;
  blobFileName?: string;
  fileType: string;
  fileSize: string;
  file?: File;
}
