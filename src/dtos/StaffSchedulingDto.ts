
export interface StaffSchedulingDisplayListResponseDto {
    totalRecord: number;
    schedules: StaffSchedulingDisplayDto[];
}

export interface StaffSchedulingDisplayDto {
    staffId: number;
    staffName: string;
    profilePicture: string;
    workingDays: WorkingDaysDto[] | null;
}

export interface WorkingDaysDto {
    id: number;
    name: string;
    addedOn: Date;
    workSchedule: StaffSchedulingBasicDto[] | null;
}

export interface WorkingDaysMappedDto {
    dayId: number;
    dayName: string;
    isMapped: boolean;
}

export interface StaffWorkingDaysDto {
    id: number;
    staffId: number;
    dayId: number;
    workingDays: WorkingDaysDto | null;
    addedOn: Date;
}

export interface StaffSchedulingDto {
    id: number;
    staffId: number;
    staffWorkingDayId: number;
    dayName: string;
    fromTime: string;
    toTime: string;
    notes: string;
    addedOn: Date;
}


export interface StaffSchedulingBasicDto {
    fromTime: string;
    toTime: string;
    notes: string;
}