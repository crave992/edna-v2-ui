import LevelDto from "./LevelDto";

export default interface AreaDto {
    id: number;
    levelId: number;
    name: string;
    referenceId: number;
    level: LevelDto;
    progress: number;
    totalAcquiredLessons: number;
    totalPracticingLessons: number;
    totalPlannedLessons: number;
    totalLessons: number;
}

export interface AreaListResponseDto {
    totalRecord: number;
    areas: AreaDto[];
}
