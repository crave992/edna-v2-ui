import PaginationParams from "./PaginationParams";

export default interface TopicListParams extends PaginationParams {
    areaId: number;
    levelId: number;
}

export interface MasterTopicListParams extends PaginationParams {
    masterAreaId: number;
    masterLevelId: number;
}
