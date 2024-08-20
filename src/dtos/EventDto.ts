export default interface EventDto {
    id: number;
    organizationId: number;
    name: string;
    eventTypeId: number;
    date: Date;
    message: string;
    allowShare: boolean | null;
    attachments: string;
    createdOn: string;
    updatedOn: string | null;
    attachmentsURL: string;
}

export interface EventTypeDto {
    id: number;
    name: string;
    createdOn: string;
}