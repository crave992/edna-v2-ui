import StaffBasicDto from "@/dtos/StaffDto";
import { StudentModel } from "./StudentModel";
import { UploadImageDto } from "@/dtos/MilestoneDto";
import { StudentBasicDto } from "@/dtos/StudentDto";

export default interface AlertModel {
  id: number;
  title: string;
  time: string;
  date?: Date | null;
  location: string;
  type?: string;
  involvement?: string;
  description: string;
  staff: StaffBasicDto[];
  student: StudentBasicDto | null;
  action: string;
  comments: string;
  image?: UploadImageDto;
  admin: Boolean;
  shareReport: AlertShareReportModel[];
  recipients: string[];
  emailSubject: string;
}

export interface AlertStaffModel {
  id: number;
  name: string;
}

export interface AlertImageModel {
  id: number;
  imageName: string;
  imageB64: string;
}
export interface AlertShareReportModel {
  id: number;
  name: string;
  email: string;
}

// models/AccidentType.ts
export enum AccidentType {
  Bruise = 'Bruise',
  Bite = 'Bite',
  CutScrape = 'Cut/scrape',
  SoreThroatCough = 'Sore Throat/Cough',
  ToothacheMouthPain = 'Toothache/Mouth Pain',
  Headache = 'Headache',
  Fever = 'Fever',
  StomachPainCramps = 'Stomach Pain/Cramps',
  VomitingDiarrhea = 'Vomiting/Diarrhea',
  Earache = 'Earache',
  ClothingChange = 'Clothing Change',
  HeadBump = 'Head Bump',
  SoreNeckBack = 'Sore Neck/Back',
  EyeIrritation = 'Eye Irritation',
  Nosebleed = 'Nosebleed',
  Other = 'Other'
}

export enum InvolvementType {
  Caused = 'Caused',
  Received = 'Received'
}