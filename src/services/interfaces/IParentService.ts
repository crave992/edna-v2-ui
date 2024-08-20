import { ParentDto, ParentListResponseDto } from "@/dtos/ParentDto";
import { ParentPaymentDto } from "@/dtos/ParentPaymentDto";
import RegistrationFeesDto from "@/dtos/RegistrationFeesDto";
import Response from "@/dtos/Response";
import { ParentModel, ParentUpdateModel } from "@/models/ParentModel";
import ParentListParams from "@/params/ParentListParams";
import { AxiosResponse } from "axios";

export default interface IParentService {
  getAll(
    q?: ParentListParams
  ): Promise<AxiosResponse<Response<ParentListResponseDto>>>;
  getByParentId(parentId: number): Promise<AxiosResponse<Response<ParentDto>>>;
  getParentPaymentDetailsByStudentId(studentId: number): Promise<AxiosResponse<Response<ParentPaymentDto>>>;
  getParentPaymentDetails(): Promise<AxiosResponse<Response<RegistrationFeesDto>>>;
  getByCurrentUserId(): Promise<AxiosResponse<Response<ParentDto>>>;
  getSecondParentDetails(): Promise<AxiosResponse<Response<ParentDto>>>;
  add(model: ParentModel): Promise<AxiosResponse<Response<ParentDto>>>;
  addSecondParent(model: FormData): Promise<AxiosResponse<Response<ParentDto>>>;
  update(model: FormData): Promise<AxiosResponse<Response<ParentDto>>>;
  resendActivationEmail(
    parentId: number
  ): Promise<AxiosResponse<Response<ParentDto>>>;
  activate(parentId: number): Promise<AxiosResponse<Response<ParentDto>>>;
  deactivate(parentId: number): Promise<AxiosResponse<Response<ParentDto>>>;
  getAllParentsByStudentId(
    studentId: number
  ): Promise<AxiosResponse<Response<ParentDto[]>>>;
  updatePicture(model: FormData): Promise<AxiosResponse<Response<ParentDto>>>;
}
