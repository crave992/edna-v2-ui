import LevelDto from "./LevelDto";
import SepAreaDto, { SepAreaListResponseDto } from "./SepAreaDto";

export default interface SepLevelDto {
    id: number;
    levelId: number;
    sepAreaId: number;
    name: string;
    level: LevelDto;
    sepArea: SepAreaDto;
    referenceId: number;
}

export interface SepLevelListResponseDto {
    totalRecord: number;
    levelId: LevelDto[];
    sepAreas: SepAreaListResponseDto[];
    sepLevels: SepLevelDto[];
    levels: LevelDto[];
}
