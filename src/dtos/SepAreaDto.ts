import LevelDto from "./LevelDto";
import SepLevelDto from "./SepLevelDto";

export default interface SepAreaDto {
  id: number;
  levelId: number;
  name: string;
  level: LevelDto;
  referenceId: number;
}

export interface SepAreaListResponseDto {
  totalRecord: number;
  levels: LevelDto[];
  sepAreas: SepAreaDto[];
}
