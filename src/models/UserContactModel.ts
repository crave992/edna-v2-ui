import UserContactDto from '@/dtos/UserContactDto';

export default interface UserContactMapModel {
  id:number;
  isEmergencyContact: boolean;
  relationship:string;
  role:string;
  childAccountAccess:boolean;
  pickupAuthorization:boolean;
  contact?: UserContactDto;
  staffId?:number;
  studentId?:number;
}
