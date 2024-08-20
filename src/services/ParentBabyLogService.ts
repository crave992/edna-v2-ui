import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import ParentBabyLogDto, { DiaperingDto, FeedingDto, NappingDto, OtherBabyLogDto } from "@/dtos/ParentBabyLogDto";
import ParentBabyLogModel from "@/models/ParentBabyLogModel";
import IParentBabyLogService from "./interfaces/IParentBabyLogService";

@injectable()
export default class ParentBabyLogService implements IParentBabyLogService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getBabyLogReportByStudentId(studentId:number): Promise<AxiosResponse<Response<ParentBabyLogDto>>> {
        let result = this.httpService
            .call()
            .get<ParentBabyLogDto, AxiosResponse<Response<ParentBabyLogDto>>>(
                `/ParentBabyLog/GetBabyLogReportByStudentId/${studentId}`
            );

        return result;
    }

    addParentBabyLog(model: ParentBabyLogModel): Promise<AxiosResponse<Response<ParentBabyLogDto>>> {
        let result = this.httpService
            .call()
            .post<ParentBabyLogDto, AxiosResponse<Response<ParentBabyLogDto>>>(
                `/ParentBabyLog`, model
            );

        return result;
    }


    getFeedingByStudentId(studentId: number): Promise<AxiosResponse<Response<FeedingDto[]>>> {
        let result = this.httpService
            .call()
            .get<FeedingDto[], AxiosResponse<Response<FeedingDto[]>>>(
                `/ParentBabyLog/GetFeedingByStudentId/${studentId}`
            );

        return result;
    }
    addFeeding(model: FormData): Promise<AxiosResponse<Response<FeedingDto>>> {
        let result = this.httpService
            .call()
            .post<FeedingDto, AxiosResponse<Response<FeedingDto>>>(
                `/ParentBabyLog/Feeding`, model
            );

        return result;
    }

    getNappingByStudentId(studentId: number): Promise<AxiosResponse<Response<NappingDto[]>>> {
        let result = this.httpService
            .call()
            .get<NappingDto[], AxiosResponse<Response<NappingDto[]>>>(
                `/ParentBabyLog/GetNappingByStudentId/${studentId}`
            );

        return result;
    }
    addNapping(model: FormData): Promise<AxiosResponse<Response<NappingDto>>> {
        let result = this.httpService
            .call()
            .post<NappingDto, AxiosResponse<Response<NappingDto>>>(
                `/ParentBabyLog/Napping`, model
            );

        return result;
    }

    getDiaperingByStudentId(studentId: number): Promise<AxiosResponse<Response<DiaperingDto[]>>> {
        let result = this.httpService
            .call()
            .get<DiaperingDto[], AxiosResponse<Response<DiaperingDto[]>>>(
                `/ParentBabyLog/GetDiaperingByStudentId/${studentId}`
            );

        return result;
    }
    addDiapering(model: FormData): Promise<AxiosResponse<Response<DiaperingDto>>> {
        let result = this.httpService
            .call()
            .post<DiaperingDto, AxiosResponse<Response<DiaperingDto>>>(
                `/ParentBabyLog/Diapering`, model
            );

        return result;
    }



    getOtherBabyLogByStudentId(studentId: number): Promise<AxiosResponse<Response<OtherBabyLogDto[]>>> {
        let result = this.httpService
            .call()
            .get<OtherBabyLogDto[], AxiosResponse<Response<OtherBabyLogDto[]>>>(
                `/ParentBabyLog/GetOtherBabyLogByStudentId/${studentId}`
            );

        return result;
    }
    addOtherBabyLog(model: FormData): Promise<AxiosResponse<Response<OtherBabyLogDto>>> {
        let result = this.httpService
            .call()
            .post<OtherBabyLogDto, AxiosResponse<Response<OtherBabyLogDto>>>(
                `/ParentBabyLog/OtherBabyLog`, model
            );

        return result;
    }
    
    
    
    
}
