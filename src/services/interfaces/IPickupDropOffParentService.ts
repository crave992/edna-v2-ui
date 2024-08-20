import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { PickupDropoffParentDto } from "@/dtos/PickupDropoffParentDto";
import PickupDropoffConfigDto from "@/dtos/PickupDropoffConfigDto";
import { PickupAuthorizationEmergencyContactConsentDto } from "@/dtos/PickupAuthorizationEmergencyContactConsentDto";
import { PickupAuthorizationEmergencyContactConsentModel } from "@/models/PickupAuthorizationEmergencyContactConsentModel";

export default interface IPickupDropOffParentService {
  getDropOffConfig(): Promise<AxiosResponse<Response<PickupDropoffConfigDto>>>;
  getAllByParentId(
    parentId: number
  ): Promise<AxiosResponse<Response<PickupDropoffParentDto[]>>>;
  getAllByParentIdAndStudnetId(
    parentId: number,
    studentid: number
  ): Promise<AxiosResponse<Response<PickupDropoffParentDto[]>>>;
  getContactsByStudentId(
    studentId: number
  ): Promise<AxiosResponse<Response<PickupDropoffParentDto[]>>>;
  getById(id: number): Promise<AxiosResponse<Response<PickupDropoffParentDto>>>;
  add(
    model: FormData
  ): Promise<AxiosResponse<Response<PickupDropoffParentDto>>>;
  update(
    id: number,
    model: FormData
  ): Promise<AxiosResponse<Response<PickupDropoffParentDto>>>;
  delete(id: number): Promise<AxiosResponse<Response<PickupDropoffParentDto>>>;

  getConsentByParentId(
    parentId: number
  ): Promise<
    AxiosResponse<Response<PickupAuthorizationEmergencyContactConsentDto>>
  >;
  saveConsent(
    model: PickupAuthorizationEmergencyContactConsentModel
  ): Promise<
    AxiosResponse<Response<PickupAuthorizationEmergencyContactConsentDto>>
  >;
}
