import PaginationParams from "./PaginationParams";

export interface StudentAllergyListParams extends PaginationParams {
    studentId: number;
    classId: number;
    levelId: number;
}