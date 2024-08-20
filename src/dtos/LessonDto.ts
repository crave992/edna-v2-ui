import AreaDto from './AreaDto';
import LevelDto from './LevelDto';
import { RecordKeepingDto } from './RecordKeepingDto';
import TopicDto from './TopicDto';
import { UserBasicDto } from './UserDto';

export default interface LessonDto {
  id: number;
  name: string;
  sequenceName: string | null;
  description: string;
  materialUsed: string;
  levelId: number;
  areaId: number;
  topicId: number;
  sequenceNumber: number;
  sequentialAssignment: string;
  level: LevelDto;
  area: AreaDto;
  topic: TopicDto;
  studentIds: number[] | null;
  studentLessonNotes: StudentLessonNotesDto[] | null;
  recordKeepings: RecordKeepingDto[] | null;
  isMappedToStudent: boolean;
  referenceId: number;
  isCustom?: boolean;
  sequenceCount?: number;
}

export interface LessonListResponseDto {
  totalRecord: number;
  lessons: LessonDto[];
}

export interface LessonRecordKeepingBasicDto {
  id: number;
  name: string;
  planned: number;
  practiced: number;
  acquired: number;
  presented: number;
}

export interface LessonReportsListResponseDto {
  totalRecord: number;
  reports: LessonDto[];
}

export interface StudentLessonNotesDto {
  id: number;
  lessonState: string;
  notes: string;
  createdOn: Date;
  createdBy: UserBasicDto;
}

export interface CustomLessonDto {
  name: string;
  sequenceName: string;
  description: string;
  materialUsed: string;
  levelId: number;
  areaId: number;
  topicId: number;
  sequenceNumber: number;
  sequentialAssignment: string;
  isCustom: boolean;
}
