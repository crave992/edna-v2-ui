import PaginationParams from "./PaginationParams";

export default interface AreaListParams extends PaginationParams {
    levelId: number;
}
export interface MasterAreaListParams extends PaginationParams {
    masterLevelId: number;
}
