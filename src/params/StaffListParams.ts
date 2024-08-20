import PaginationParams from "./PaginationParams";

export default interface StaffListParams extends PaginationParams {
    jobTitleId: number;
    roleId: number;
    salaryTypeId: number;
    status?: string;
}
