import PaginationParams from "./PaginationParams";


export interface ClassAttendanceReportsListParams extends PaginationParams {
    fromDate: string;
    toDate: string;
    classId: number;
}

export interface ClassAttendanceReportsListParamsModel extends PaginationParams {
    fromDate: Date;
    toDate: Date;
    classId: number;
}