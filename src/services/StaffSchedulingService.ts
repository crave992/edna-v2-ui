import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import IStaffSchedulingService from "./interfaces/IStaffSchedulingService";
import { StaffSchedulingDisplayDto, StaffSchedulingDisplayListResponseDto, StaffSchedulingDto, WorkingDaysDto, WorkingDaysMappedDto } from "@/dtos/StaffSchedulingDto";
import StaffWorkingDaysSchedulingModel from "@/models/StaffWorkingDaysSchedulingModel";
import PlainDto from "@/dtos/PlainDto";
import { StaffSchedulingModel, StaffSchedulingSaveModel } from "@/models/StaffSchedulingModel";
import StaffSchedulesParams from "@/params/StaffSchedulesParams";

@injectable()
export default class StaffSchedulingService implements IStaffSchedulingService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAllWorkingDays(): Promise<AxiosResponse<Response<WorkingDaysDto[]>>> {
        let result = this.httpService
            .call()
            .get<WorkingDaysDto[], AxiosResponse<Response<WorkingDaysDto[]>>>(`/StaffWorkingDayScheduling/GetAllWorkingDays`);

        return result;
    }

    getAllStaffScheduling(p: StaffSchedulesParams): Promise<AxiosResponse<Response<StaffSchedulingDisplayListResponseDto>>> {
        let result = this.httpService
            .call()
            .get<StaffSchedulingDisplayListResponseDto, AxiosResponse<Response<StaffSchedulingDisplayListResponseDto>>>(`/StaffWorkingDayScheduling/GetAllStaffScheduling`, {
                params: p
            });

        return result;
    }

    getWorkingDaysByStaffId(staffId: number): Promise<AxiosResponse<Response<WorkingDaysMappedDto[]>>> {
        let result = this.httpService
            .call()
            .get<WorkingDaysMappedDto[], AxiosResponse<Response<WorkingDaysMappedDto[]>>>(`/StaffWorkingDayScheduling/GetWorkingDaysByStaffId/${staffId}`);

        return result;
    }

    saveStaffWorkingDays(model: StaffWorkingDaysSchedulingModel): Promise<AxiosResponse<Response<PlainDto>>> {
        let result = this.httpService
            .call()
            .post<PlainDto, AxiosResponse<Response<PlainDto>>>(`/StaffWorkingDayScheduling/SaveStaffWorkingDays`, model);

        return result;
    }

    getStaffSchedulingByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffSchedulingDto[]>>> {
        let result = this.httpService
            .call()
            .get<StaffSchedulingDto[], AxiosResponse<Response<StaffSchedulingDto[]>>>(`/StaffWorkingDayScheduling/GetStaffSchedulingByStaffId/${staffId}`);

        return result;
    }

    getStaffSchedulingByStaffIdAndId(staffId: number, id: number): Promise<AxiosResponse<Response<StaffSchedulingDto>>> {
        let result = this.httpService
            .call()
            .get<StaffSchedulingDto, AxiosResponse<Response<StaffSchedulingDto>>>(`/StaffWorkingDayScheduling/GetStaffSchedulingByStaffIdAndId/${staffId}/${id}`);

        return result;
    }

    add(modal: StaffSchedulingSaveModel): Promise<AxiosResponse<Response<StaffSchedulingDto[]>>> {
        let result = this.httpService
            .call()
            .post<StaffSchedulingDto[], AxiosResponse<Response<StaffSchedulingDto[]>>>(`/StaffWorkingDayScheduling`, modal);

        return result;
    }

    update(id: number, modal: StaffSchedulingModel): Promise<AxiosResponse<Response<StaffSchedulingDto>>> {
        let result = this.httpService
            .call()
            .put<StaffSchedulingDto, AxiosResponse<Response<StaffSchedulingDto>>>(`/StaffWorkingDayScheduling/${id}`, modal);

        return result;
    }

    delete(id: number, staffId: number): Promise<AxiosResponse<Response<StaffSchedulingDto>>> {
        let result = this.httpService
            .call()
            .delete<StaffSchedulingDto, AxiosResponse<Response<StaffSchedulingDto>>>(`/StaffWorkingDayScheduling/${staffId}/${id}`);

        return result;
    }
}
