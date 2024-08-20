export default interface PickUpDropOffStudentWiseDto {
    id: number;
    studentId: number;
    dropOffByPersonId: number | null;
    pickUpByPersonId: number | null;
    pickupDropOffDate: string;
    dropOffTime: string | null;
    pickupTime: string | null;
}

export interface PickUpDropOffStudentWiseBasicDto {
    id: number;
    studentName: string;
    dropOffBy: string;
    dropOffTime: string | null;
    pickupBy: string;
    pickupTime: string | null;
    pickupDropOffDate: Date;
    pickupDropOffDateString: string;
}

export interface PickUpDropOffStudentWiseListResponseDto {
    totalRecord: number;
    contacts: PickUpDropOffStudentWiseBasicDto[];
}