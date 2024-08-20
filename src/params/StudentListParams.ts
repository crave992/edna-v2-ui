import PaginationParams from "./PaginationParams";

export default interface StudentListParams extends PaginationParams {
    levelId: number;
    classId: number;
    ageFilter?: string;
    active?: string;
}
