export default interface StudentConsentFormDto {
    levelId: number;
    levelName: string;
    studentId: number;
    studentFormId: number;
    studentFormName: string;
    docUrl: string;
    status: boolean;
    acceptTerms: boolean;
    uploadedDate: Date | null;
    templateId: string;
}