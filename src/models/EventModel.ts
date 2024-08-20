export interface EventModel {
    id: number;
    name: string;
    message: string;
    eventTypeId: number;
    date: Date;
    allowShare: boolean | null;
    attachments: FileList;
    attachmentsURL: string;
}