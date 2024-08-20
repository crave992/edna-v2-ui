export default interface ParentBabyLogDto {
    id: number;
    organizationId: number;
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
    healthCheck: string | null;
    mood: string | null;
    createdOn: string;
}

export interface FeedingDto {
    id: number;
    message: string | null;
    url: string;
    createdOn: string;
    feedingTime: string;
}

export interface NappingDto {
    id: number;
    studentId: number;
    fromTime: string | null;
    toTime: string | null;
    message: string | null;
    url: string | null;
    createdOn: string;
}

export interface DiaperingDto {
    id: number;
    studentId: number;
    diaperChangedTime: string | null;
    type: string | null;
    message: string | null;
    isDiaperRashCreamApplied: boolean | null;
    url: string | null;
    createdOn: string;
}

export interface OtherBabyLogDto {
    id: number;
    studentId: number;
    title: string | null;
    message: string | null;
    url: string | null;
    createdOn: string;
}