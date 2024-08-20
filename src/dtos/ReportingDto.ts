export default interface ReportingDto {
  id: number;
  report: string;
  date: string;
  data: string;
  type: string;
}

export interface ReportingGenerateDto {
  title: string;
  date?: string;
  status?: {
    Present: boolean;
    Tardy: boolean;
    Excused: boolean;
    Unexcused: boolean;
    ReleasedEarly: boolean;
  };
  allergies?: {
    Severe: boolean;
    NonSevere: boolean;
    FoodRestrictions: boolean;
  };
  emergencyContacts?: {
    All: boolean;
    First: boolean;
    Second: boolean;
    Third: boolean;
  };
  otherInformation?: {
    MedicalConditions: boolean;
    PreferredHospital: boolean;
    WhatToDoInCase: boolean;
  };
  includeNotes?: number;
  levelId?: number;
  classId?: number;
  students?: string;
  staffs?: string;
  medications?: number;
  immunizations?: number;
  studentsProfile?: {
    DateOfBirth: boolean;
    Gender: boolean;
    Demographics: boolean;
    Address: boolean;
  };
  program?: {
    Level: boolean;
    Program: boolean;
    AdditionalCare: boolean;
  };
  aboutQuestions?: number;
  permissions?: number;
  studentContacts?: {
    Guardian: boolean;
    FamilyOrFriend: boolean;
    ChildCare: boolean;
    HealthCare: boolean;
  };
  parentsProfile?: {
    HomeEmail: boolean;
    WorkEmail: boolean;
    CellPhone: boolean;
    HomePhone: boolean;
    Address: boolean;
    Occupation: boolean;
  };
  includeLinkedChildren?: number;
  employment?: {
    Position: boolean;
    Compensation: boolean;
    StartDate: boolean;
    TerminationDate: boolean;
    TerminationReason: boolean;
  };
  staffProfile?: {
    Description: boolean;
    WorkEmail: boolean;
    PersonalEmail: boolean;
    CellPhone: boolean;
    HomePhone: boolean;
    Demographics: boolean;
    Address: boolean;
  };
  staffContacts?: {
    Guardian: boolean;
    FamilyOrFriend: boolean;
    ChildCare: boolean;
    HealthCare: boolean;
  };
  classLeadGuide?: number;
  classStaff?: number;
  classLevel?: number;
  classCapacity?: number;
  classStudentList?: number;
  progressLeadGuide?: number;
  progressStaff?: number;
  progressLevel?: number;
  progressCapacity?: number;
}
