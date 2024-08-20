import { TYPES } from "@/config/types";
import IStaffService from "./interfaces/IStaffService";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import StaffDto, { StaffBankAccountInfoDto, StaffBasicDto, StaffEmergencyInfoDto, StaffEmploymentFormBasicDto, StaffEmploymentFormDto, StaffListResponseDto, StaffMedicalConditionDto } from "@/dtos/StaffDto";
import { StaffActivateModel, StaffBankAccountInfoModel, StaffDeactivateModel, StaffEmergencyInfoModel, StaffMedicalConditionModel } from "@/models/StaffModel";
import StaffListParams from "@/params/StaffListParams";

@injectable()
export default class StaffService implements IStaffService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(p?: StaffListParams): Promise<AxiosResponse<Response<StaffListResponseDto>>> {
        let result = this.httpService
            .call()
            .get<StaffListResponseDto, AxiosResponse<Response<StaffListResponseDto>>>(`/Staff`, {
                params: p
            });

        return result;
    }

    getStaffListBasic(): Promise<AxiosResponse<Response<StaffBasicDto[]>>> {
        let result = this.httpService
            .call()
            .get<StaffBasicDto[], AxiosResponse<Response<StaffBasicDto[]>>>(`/Staff/GetStaffListBasic`);

        return result;
    }

    getStaffByClassId(classId?: number, q?: string): Promise<AxiosResponse<Response<StaffBasicDto[]>>> {
        let result = this.httpService
            .call()
            .get<StaffBasicDto[], AxiosResponse<Response<StaffBasicDto[]>>>(`/Staff/GetStaffByClassId/?classId=${classId}&q=${q}`);

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<StaffDto>>> {
        let result = this.httpService
            .call()
            .get<StaffDto, AxiosResponse<Response<StaffDto>>>(`/Staff/${id}`);

        return result;
    }

    getCurrentStaffDetails(): Promise<AxiosResponse<Response<StaffDto>>> {
        let result = this.httpService
            .call()
            .get<StaffDto, AxiosResponse<Response<StaffDto>>>(`/Staff/GetCurrentStaffDetails`);

        return result;
    }

    getBasicDetailById(id: number): Promise<AxiosResponse<Response<StaffDto>>> {
        let result = this.httpService
            .call()
            .get<StaffDto, AxiosResponse<Response<StaffDto>>>(`/Staff/GetBasicDetailById/${id}`);

        return result;
    }

    getCurrentStaffBasicDetail(): Promise<AxiosResponse<Response<StaffDto>>> {
        let result = this.httpService
            .call()
            .get<StaffDto, AxiosResponse<Response<StaffDto>>>(`/Staff/GetCurrentStaffBasicDetail`);

        return result;
    }

    add(model: FormData): Promise<AxiosResponse<Response<StaffDto>>> {
        let result = this.httpService
            .call()
            .post<StaffDto, AxiosResponse<Response<StaffDto>>>(`/Staff`, model);

        return result;
    }

    resendActivationEmail(staffId: number): Promise<AxiosResponse<Response<StaffDto>>> {
        let result = this.httpService
            .call()
            .post<StaffDto, AxiosResponse<Response<StaffDto>>>(
                `/Staff/ResendActivationEmail/${staffId}`
            );

        return result;
    }

    update(
        id: number,
        model: FormData
    ): Promise<AxiosResponse<Response<StaffDto>>> {
        let result = this.httpService
            .call()
            .put<StaffDto, AxiosResponse<Response<StaffDto>>>(
                `/Staff/${id}`,
                model
            );

        return result;
    }

    activateStaff(
        id: number,
        model: StaffActivateModel
    ): Promise<AxiosResponse<Response<StaffDto>>> {
        let result = this.httpService
            .call()
            .patch<StaffDto, AxiosResponse<Response<StaffDto>>>(
                `/Staff/Activate/${id}`,
                model
            );

        return result;
    }

    deactivateStaff(
        id: number,
        model: StaffDeactivateModel
    ): Promise<AxiosResponse<Response<StaffDto>>> {
        let result = this.httpService
            .call()
            .patch<StaffDto, AxiosResponse<Response<StaffDto>>>(
                `/Staff/Deactivate/${id}`,
                model
            );

        return result;
    }

    updateBySelf(
        model: FormData
    ): Promise<AxiosResponse<Response<StaffDto>>> {
        let result = this.httpService
            .call()
            .put<StaffDto, AxiosResponse<Response<StaffDto>>>(
                `/Staff/UpdateBySelf`,
                model
            );

        return result;
    }

    getEmergencyInfoByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffEmergencyInfoDto>>> {
        let result = this.httpService
            .call()
            .get<StaffEmergencyInfoDto, AxiosResponse<Response<StaffEmergencyInfoDto>>>(`/Staff/GetEmergencyInfoByStaffId/${staffId}`);

        return result;
    }

    getEmergencyInfo(): Promise<AxiosResponse<Response<StaffEmergencyInfoDto>>> {
        let result = this.httpService
            .call()
            .get<StaffEmergencyInfoDto, AxiosResponse<Response<StaffEmergencyInfoDto>>>(`/Staff/GetEmergencyInfo`);

        return result;
    }

    saveEmergencyInfo(model: StaffEmergencyInfoModel): Promise<AxiosResponse<Response<StaffEmergencyInfoDto>>> {
        let result = this.httpService
            .call()
            .post<StaffEmergencyInfoDto, AxiosResponse<Response<StaffEmergencyInfoDto>>>(`/Staff/EmergencyInfo`, model);

        return result;
    }


    getMedicalConditionByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffMedicalConditionDto>>> {
        let result = this.httpService
            .call()
            .get<StaffMedicalConditionDto, AxiosResponse<Response<StaffMedicalConditionDto>>>(`/Staff/GetMedicalConditionByStaffId/${staffId}`);

        return result;
    }

    getMedicalCondition(): Promise<AxiosResponse<Response<StaffMedicalConditionDto>>> {
        let result = this.httpService
            .call()
            .get<StaffMedicalConditionDto, AxiosResponse<Response<StaffMedicalConditionDto>>>(`/Staff/GetMedicalCondition`);

        return result;
    }

    saveMedicalCondition(model: StaffMedicalConditionModel): Promise<AxiosResponse<Response<StaffMedicalConditionDto>>> {
        let result = this.httpService
            .call()
            .post<StaffMedicalConditionDto, AxiosResponse<Response<StaffMedicalConditionDto>>>(`/Staff/MedicalCondition`, model);

        return result;
    }


    getBankAccountInfoByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffBankAccountInfoDto>>> {
        let result = this.httpService
            .call()
            .get<StaffBankAccountInfoDto, AxiosResponse<Response<StaffBankAccountInfoDto>>>(`/Staff/GetBankAccountInfoByStaffId/${staffId}`);

        return result;
    }

    getBankAccountInfo(): Promise<AxiosResponse<Response<StaffBankAccountInfoDto>>> {
        let result = this.httpService
            .call()
            .get<StaffBankAccountInfoDto, AxiosResponse<Response<StaffBankAccountInfoDto>>>(`/Staff/GetBankAccountInfo`);

        return result;
    }

    saveBankAccountInfo(model: StaffBankAccountInfoModel): Promise<AxiosResponse<Response<StaffBankAccountInfoDto>>> {
        let result = this.httpService
            .call()
            .post<StaffBankAccountInfoDto, AxiosResponse<Response<StaffBankAccountInfoDto>>>(`/Staff/BankAccountInfo`, model);

        return result;
    }


    getEmploymentFormByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffEmploymentFormBasicDto[]>>> {
        let result = this.httpService
            .call()
            .get<StaffEmploymentFormBasicDto[], AxiosResponse<Response<StaffEmploymentFormBasicDto[]>>>(`/Staff/GetEmploymentFormByStaffId/${staffId}`);

        return result;
    }

    getEmploymentForm(): Promise<AxiosResponse<Response<StaffEmploymentFormBasicDto[]>>> {
        let result = this.httpService
            .call()
            .get<StaffEmploymentFormBasicDto[], AxiosResponse<Response<StaffEmploymentFormBasicDto[]>>>(`/Staff/GetEmploymentForm`);

        return result;
    }

    saveEmploymentForm(model: FormData): Promise<AxiosResponse<Response<StaffEmploymentFormDto>>> {
        let result = this.httpService
            .call()
            .post<StaffEmploymentFormDto, AxiosResponse<Response<StaffEmploymentFormDto>>>(`/Staff/EmploymentForm`, model);

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<StaffDto>>> {
        let result = this.httpService
            .call()
            .delete<StaffDto, AxiosResponse<Response<StaffDto>>>(
                `/Staff/${id}`
            );

        return result;
    }

    updatePicture(model: FormData): Promise<AxiosResponse<Response<StaffDto>>> {
        let result = this.httpService
          .call()
          .put<StaffDto, AxiosResponse<Response<StaffDto>>>(`/Staff/UpdatePicture`, model);
        return result;
      }
}
