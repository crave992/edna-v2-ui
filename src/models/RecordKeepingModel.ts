export default interface RecordKeepingModel {
    status: string;
    actionDate: Date;
    count: number;
    reReview:boolean;
}

export interface RecordKeepingLessonNotesModel{
    id: number;
    notes: string;
}