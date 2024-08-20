export interface StudentAllergyReportDto {
    map(arg0: (allergy: any) => JSX.Element): import("react").ReactNode;
    id: number;
    studentId: number;
    studentName: string;
    allergyName: string | null;
    allergyIndication: string | null;
    actionTakenAgainstReaction: string | null;
    actionTakenAgainstSeriousReaction: string | null;
    contactPersonName1: string | null;
    contactPersonPhoneNumber1: string | null;
    contactPersonName2: string | null;
    contactPersonPhoneNumber2: string | null;
    callAnAmbulance: boolean | null;
    medicalForm: string | null;
}

export interface StudentAllergyListResponseDto {
    totalRecord: number;
    reports: StudentAllergyReportDto[];
}