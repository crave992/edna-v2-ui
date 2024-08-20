export default interface ParentBabyLogModel {
    studentId: number;
    bedTime: string | null;
    wakeTime: string | null;
    lastSlept: string | null;
    hours: number | null;
    minutes: number | null;
    lastFed: string | null;
    quantity: number | null;
    lastDiapered: string | null;
    diaperContent: string | null;
    healthCheck: string[] | null;
    mood: string | null;
}


export interface FeedingModel {
    studentId: number;
    feedingTime: string | null;
    quantity: number | null;
    message: string | null;
    document: FileList;
}


export interface NappingModel {
    studentId: number;
    fromTime: string | null;
    toTime: string | null;
    message: string | null;
    document: FileList;
}


export interface DiaperingModel {
    studentId: number;
    diaperChangedTime: string | null;
    type: string | null;
    message: string | null;
    isDiaperRashCreamApplied: boolean | null;
    document: FileList;
}

export interface OtherBabyLogModel {
    studentId: number;
    title: string | null;
    message: string | null;
    document: FileList;
}