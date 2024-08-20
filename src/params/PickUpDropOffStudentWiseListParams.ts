import PaginationParams from "./PaginationParams";

export default interface PickUpDropOffStudentWiseListParams extends PaginationParams {
    fromDate: string;
    toDate: string;
    parentId: number;
    studentId: number;
}


export interface PickUpDropOffStudentWiseListParamsModel extends PaginationParams {
    fromDate: Date;
    toDate: Date;
    parentId: number;
    studentId: number;
}