import PaginationParams from "./PaginationParams";

export default interface StaffSchedulesParams extends PaginationParams {
    staffId: number;
    fetchAll?: string;
}
