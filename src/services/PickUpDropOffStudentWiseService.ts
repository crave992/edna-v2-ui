import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import PickUpDropOffStudentWiseModel from "@/models/PickUpDropOffStudentWiseModel";
import PickUpDropOffStudentWiseDto, { PickUpDropOffStudentWiseBasicDto, PickUpDropOffStudentWiseListResponseDto } from "@/dtos/PickUpDropOffStudentWiseDto";
import IPickUpDropOffStudentWiseService from "./interfaces/IPickUpDropOffStudentWiseService";
import PickUpDropOffStudentWiseListParams from "@/params/PickUpDropOffStudentWiseListParams";

@injectable()
export default class PickUpDropOffStudentWiseService implements IPickUpDropOffStudentWiseService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(p?: PickUpDropOffStudentWiseListParams): Promise<AxiosResponse<Response<PickUpDropOffStudentWiseListResponseDto>>> {
        let result = this.httpService
            .call()
            .get<PickUpDropOffStudentWiseListResponseDto, AxiosResponse<Response<PickUpDropOffStudentWiseListResponseDto>>>(`/PickUpDropOffStudentWise`, {
                params: p
            });

        return result;
    }

    getTodaysPickupDropOff(): Promise<AxiosResponse<Response<PickUpDropOffStudentWiseBasicDto[]>>> {
        let result = this.httpService
            .call()
            .get<PickUpDropOffStudentWiseBasicDto[], AxiosResponse<Response<PickUpDropOffStudentWiseBasicDto[]>>>(`/PickUpDropOffStudentWise/GetTodaysPickupDropOff`);

        return result;
    }

    savePickUpDropOffStudentWise(model: PickUpDropOffStudentWiseModel): Promise<AxiosResponse<Response<PickUpDropOffStudentWiseDto>>> {
        let result = this.httpService
            .call()
            .post<PickUpDropOffStudentWiseDto, AxiosResponse<Response<PickUpDropOffStudentWiseDto>>>(`/PickUpDropOffStudentWise`, model);

        return result;
    }
}
