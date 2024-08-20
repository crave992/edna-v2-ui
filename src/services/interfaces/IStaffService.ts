import Response from "@/dtos/Response";
import StaffDto, { StaffBankAccountInfoDto, StaffBasicDto, StaffEmergencyInfoDto, StaffEmploymentFormBasicDto, StaffEmploymentFormDto, StaffListResponseDto, StaffMedicalConditionDto } from "@/dtos/StaffDto";
import { StaffActivateModel, StaffBankAccountInfoModel, StaffDeactivateModel, StaffEmergencyInfoModel, StaffMedicalConditionModel } from "@/models/StaffModel";
import StaffListParams from "@/params/StaffListParams";
import { AxiosResponse } from "axios";

export default interface IStaffService {

    getAll(q?: StaffListParams): Promise<AxiosResponse<Response<StaffListResponseDto>>>;
    getStaffByClassId(classId?: number, q?:string): Promise<AxiosResponse<Response<StaffBasicDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<StaffDto>>>;
    getStaffListBasic(): Promise<AxiosResponse<Response<StaffBasicDto[]>>>;
    getCurrentStaffDetails(): Promise<AxiosResponse<Response<StaffDto>>>;

    getBasicDetailById(id: number): Promise<AxiosResponse<Response<StaffDto>>>;
    getCurrentStaffBasicDetail(): Promise<AxiosResponse<Response<StaffDto>>>;

    add(model: FormData): Promise<AxiosResponse<Response<StaffDto>>>;
    resendActivationEmail(staffId: number): Promise<AxiosResponse<Response<StaffDto>>>;
    update(id: number, model: FormData): Promise<AxiosResponse<Response<StaffDto>>>;

    activateStaff(id: number, model: StaffActivateModel): Promise<AxiosResponse<Response<StaffDto>>>;
    deactivateStaff(id: number, model: StaffDeactivateModel): Promise<AxiosResponse<Response<StaffDto>>>;

    updateBySelf(model: FormData): Promise<AxiosResponse<Response<StaffDto>>>;

    getEmergencyInfoByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffEmergencyInfoDto>>>;
    getEmergencyInfo(): Promise<AxiosResponse<Response<StaffEmergencyInfoDto>>>;
    saveEmergencyInfo(model: StaffEmergencyInfoModel): Promise<AxiosResponse<Response<StaffEmergencyInfoDto>>>;

    getMedicalConditionByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffMedicalConditionDto>>>;
    getMedicalCondition(): Promise<AxiosResponse<Response<StaffMedicalConditionDto>>>;
    saveMedicalCondition(model: StaffMedicalConditionModel): Promise<AxiosResponse<Response<StaffMedicalConditionDto>>>;

    getBankAccountInfoByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffBankAccountInfoDto>>>;
    getBankAccountInfo(): Promise<AxiosResponse<Response<StaffBankAccountInfoDto>>>;
    saveBankAccountInfo(model: StaffBankAccountInfoModel): Promise<AxiosResponse<Response<StaffBankAccountInfoDto>>>;

    getEmploymentFormByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffEmploymentFormBasicDto[]>>>;
    getEmploymentForm(): Promise<AxiosResponse<Response<StaffEmploymentFormBasicDto[]>>>;
    saveEmploymentForm(model: FormData): Promise<AxiosResponse<Response<StaffEmploymentFormDto>>>;

    delete(id: number): Promise<AxiosResponse<Response<StaffDto>>>;
    updatePicture(model: FormData): Promise<AxiosResponse<Response<StaffDto>>>;
}
