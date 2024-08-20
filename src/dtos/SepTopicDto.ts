import LevelDto from "./LevelDto";
import SepAreaDto, { SepAreaListResponseDto } from "./SepAreaDto";
import SepLevelDto from "./SepLevelDto";

export default interface SepTopicDto {
    id: number;
    levelId: number;
    sepAreaId: number;
    sepLevelId: number;
    name: string;
    level: LevelDto;
    sepArea: SepAreaDto;
    sepLevel: SepLevelDto;
    referenceId: number;
}

export interface SepTopicListResponseDto {
    totalRecord: number;
    levelId: LevelDto[];
    sepAreas: SepAreaDto[];
    sepLevels: SepLevelDto[];
    sepTopics: SepTopicDto[];
}

export interface SepTopicAssessmentDto {
    sepAssessmentId: number;
    sepTopicId: number;
    sepTopicName: string;
    status: string;
    comment: string;
    assessmentDate: Date | null;
}