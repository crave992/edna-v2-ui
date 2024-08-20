import HolidayTypeModel from "./HolidayTypeModel";

export default interface HolidayModel {
    id: number;
    holidayTypeId: number;
    name: string;
    message: string;
    startDate: Date;
    endDate: Date;
    allowShare: boolean | null;
    attachmentURL?: string;
    attachments: FileList;
    holidayType: HolidayTypeModel;
}