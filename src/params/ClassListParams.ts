import PaginationParams from "./PaginationParams";

export default interface ClassListParams extends PaginationParams {
    levelId: number;
    semesterId: number;
}
