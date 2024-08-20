import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import ISEPAssessmentService from "./interfaces/ISEPAssessmentService";
import { SepTopicAssessmentDto } from "@/dtos/SepTopicDto";
import { SEPAssessmentDto, SEPAssessmentHistoryDto } from "@/dtos/SEPAssessmentDto";
import SEPAssessmentModel from "@/models/SEPAssessmentModel";

@injectable()
export default class SEPAssessmentService implements ISEPAssessmentService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getSepTopicsForAssessment(studentId: number, classId: number, levelId: number, sepAreaId: number, sepLevelId: number): Promise<AxiosResponse<Response<SepTopicAssessmentDto[]>>> {
        let result = this.httpService
            .call()
            .get<
                SepTopicAssessmentDto[],
                AxiosResponse<Response<SepTopicAssessmentDto[]>>
            >(`/SEPAssessment/GetSepTopicsForAssessment/${studentId}/${classId}/${levelId}/${sepAreaId}/${sepLevelId}`);

        return result;
    }
    
    getById(id: number): Promise<AxiosResponse<Response<SEPAssessmentDto>>> {
        let result = this.httpService
            .call()
            .get<SEPAssessmentDto, AxiosResponse<Response<SEPAssessmentDto>>>(
                `/SEPAssessment/${id}`
            );

        return result;
    }

    getHistory(sepAssessmentId: number, studentId: number, classId: number, sepTopicId: number): Promise<AxiosResponse<Response<SEPAssessmentHistoryDto[]>>> {
        let result = this.httpService
            .call()
            .get<SEPAssessmentHistoryDto[], AxiosResponse<Response<SEPAssessmentHistoryDto[]>>>(
                `/SEPAssessment/History/${sepAssessmentId}/${studentId}/${classId}/${sepTopicId}`
            );

        return result;
    }    

    save(studentId: number, classId: number, sepTopicId: number, model: SEPAssessmentModel): Promise<AxiosResponse<Response<SEPAssessmentDto>>> {
        let result = this.httpService
            .call()
            .post<SEPAssessmentDto, AxiosResponse<Response<SEPAssessmentDto>>>(
                `/SEPAssessment/Save/${studentId}/${classId}/${sepTopicId}`,
                model
            );

        return result;
    }
}
