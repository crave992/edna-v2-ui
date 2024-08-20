export interface StaffSchedulingModel {
    id: number;
    staffId: number;
    staffWorkingDayId: number;
    fromTime: string;
    toTime: string;
    notes: string;
}

export interface StaffSchedulingSaveModel {
    id: number;
    staffId: number;
    staffWorkingDayIds: number[];
    fromTime: string;
    toTime: string;
    notes: string;
}