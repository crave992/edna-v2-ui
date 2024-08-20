import AreaDto from './AreaDto';
import LevelDto from './LevelDto';

export default interface TopicDto {
  id: number;
  areaId: number;
  levelId: number;
  name: string;
  area: AreaDto;
  level: LevelDto;
  referenceId: number;
  sequence?: number;
}

export interface TopicListResponseDto {
  totalRecord: number;
  topics: TopicDto[];
}
