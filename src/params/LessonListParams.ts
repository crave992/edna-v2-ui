import PaginationParams from "./PaginationParams";

export default interface LessonListParams extends PaginationParams {
    levelId: number;
    areaId: number;
    topicId: number;
    classId?: number;
}
export interface MasterLessonListParams extends PaginationParams {
    masterLevelId: number;
    masterAreaId: number;
    masterTopicId: number;
    classId?: number;
}

export interface LessonReportsListParams extends PaginationParams{
    studentId: number;
    classId: number;
    levelId: number;
    areaId: number;
    topicId: number;
    status: string;
}