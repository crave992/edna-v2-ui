export interface StaffTimeTrackingDto {
  id: number;
  organizationId: number;
  staffId: number;
  trackingDate: Date;
  action: string;
  time: string;
  createdOn: string;
}

export interface StaffTimeTrackingBasicDto {
  id: number;
  organizationId: number;
  staffId: number;
  staffName: string;
  trackingDate: string;
  trackingDateString: string;
  action: string;
  time: string;
}

export interface StaffTimeTrackingListResponseDto {
  totalRecord: number;
  trackings: StaffTimeTrackingBasicDto[];
}
