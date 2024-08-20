import HolidayTypeDto from "./HolidayTypeDto";

export default interface HolidayDto {
    id: number;
    organizationId: number;
    holidayTypeId: number;
    name: string;
    message: string;
    startDate: Date;
    endDate: Date;
    allowShare: boolean | null;
    attachments: string;
    createdOn: string;
    holidayType: HolidayTypeDto;
    attachmentURL: string;
}