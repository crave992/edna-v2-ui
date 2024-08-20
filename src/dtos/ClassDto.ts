import ClassAttendanceDto from './ClassAttendanceDto';
import LevelDto from './LevelDto';
import SemesterDto from './SemesterDto';
import { StudentBasicDto } from './StudentDto';
export default interface ClassDto {
  id: number;
  name: string;
  levelId: number;
  semesterId: number;
  capacity: number;
  location: string;
  level: LevelDto;
  semester: SemesterDto;
  leadGuideId: number;
  isMappedToClass: boolean;
  showBannerGallery: boolean;
  classImageGallery: ClassImageGalleryDto[];
  genderWiseCount: StudentCountInClass[];
  students: StudentBasicDto[];
  classStaff: ClassStaffDto[];
  isActive:boolean;
  classAttendance: ClassAttendanceDto[];
  ages: AgesDto[]
}

export interface ClassBasicDto {
  id: number;
  name: string;
  isMappedToClass: boolean;
  levelId: number;
  levelName: string;
}

export interface ClassMilestoneDto {
  id: number;
  classId: number;
  className: string;
  fromDate: string;
  levelId: number;
  levelName: string;
  studentId: number;
  toDate: string | null;
}

export interface ClassAddDto {
  id?: number;
  name: string;
  levelId: number;
  semesterId: number;
  capacity: number;
  location: string;
  leadGuides: ClassStaffDto[] | null;
  associateGuides: ClassStaffDto[] | null;
  specialistGuides: ClassStaffDto[] | null;
  leadGuideClassAssignment: GuideDto[] | null;
  associateGuideClassAssignment: GuideDto[] | null;
  specialistClassAssignment: GuideDto[] | null;
  studentClassAssignment: StudentBasicDto[] | null;
  students: StudentBasicDto[] | null;
}

export interface GuideDto {
  staffId: number;
  classId?: number;
}

export interface ClassListResponseDto {
  totalRecord: number;
  classes: ClassDto[];
}

export interface StudentCountInClass {
  total: number;
  gender: string;
}

export interface ClassForStaffDashboardDto {
  classId: number;
  className: string;
  capacity: number;
  totalStudent: number;
}

export interface ClassAssociateStaffDto {
  id: number;
  associateFirstName: string;
  associateLastName: string;
  profilePicture: string;
}

export interface ClassStaffDto {
  id: number;
  firstName: string;
  lastName: string;
  profilePicture: string;
  type: StaffType;
}

export interface AssociateGuideDto {
  staffId?: number;
}

export interface ClassImageGalleryDto {
  id: number;
  imageUrl: string;
  createdBy: string;
  createdOn: string;
  imageName: string;
  imageType: string;
  imageSize: string;
}

export enum StaffType {
  LeadGuide = 1,
  AssociateGuide = 2,
  Specialist = 3,
}

export interface AgesDto {
  age: number;
  count: number
}