import LessonDto from './LessonDto';

export default interface SortedAndGroupedLessons {
  areaName: string;
  lessons: LessonDto[];
  topicName: string;
  totalSequence: number;
  totalLessons: number;
}
