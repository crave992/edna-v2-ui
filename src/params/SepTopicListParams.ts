import PaginationParams from "./PaginationParams";

export default interface SepTopicListParams extends PaginationParams {
    levelId: number;
    sepAreaId: number;
    sepLevelId: number;
}
export interface MasterSepTopicListParams extends PaginationParams {
    masterLevelId: number;
    masterSepAreaId: number;
    masterSepLevelId: number;
}
