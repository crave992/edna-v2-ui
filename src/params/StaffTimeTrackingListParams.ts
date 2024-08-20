import PaginationParams from "./PaginationParams";

export interface StaffTimeTrackingListParams extends PaginationParams {
  staffId: number;
  fromDate: string;
  toDate: string;
}

export interface StaffTimeTrackingListParamsModel extends PaginationParams {
  staffId: number;
  fromDate: Date;
  toDate: Date;
}
