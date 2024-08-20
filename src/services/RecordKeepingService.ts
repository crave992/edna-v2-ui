import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import IRecordKeepingService from "./interfaces/IRecordKeepingService";
import { RecordKeepingDto, RecordKeepingHistoryDto } from "@/dtos/RecordKeepingDto";
import RecordKeepingModel, { RecordKeepingLessonNotesModel } from "@/models/RecordKeepingModel";

@injectable()
export default class RecordKeepingService implements IRecordKeepingService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getByStudentIdClassIdAndLessonId(studentId: number, classId: number, lessonId: number): Promise<AxiosResponse<Response<RecordKeepingDto[]>>> {
        let result = this.httpService
            .call()
            .get<RecordKeepingDto[], AxiosResponse<Response<RecordKeepingDto[]>>>(
                `/RecordKeeping/${studentId}/${classId}/${lessonId}`
            );

        return result;
    }

    getHistoryByRecordKeepingId(recordKeepingId: number): Promise<AxiosResponse<Response<RecordKeepingHistoryDto[]>>> {
        let result = this.httpService
            .call()
            .get<RecordKeepingHistoryDto[], AxiosResponse<Response<RecordKeepingHistoryDto[]>>>(
                `/RecordKeeping/History/${recordKeepingId}`
            );

        return result;
    }

    save(studentId: number, classId: number, lessonId: number, modal: RecordKeepingModel): Promise<AxiosResponse<Response<RecordKeepingDto>>> {
        let result = this.httpService
            .call()
            .post<RecordKeepingDto, AxiosResponse<Response<RecordKeepingDto>>>(
                `/RecordKeeping/Save/${studentId}/${classId}/${lessonId}`, modal
            );

        return result;
    }    

    updateRecordKeepingNotes(studentId: number, classId: number, lessonId: number, modal: RecordKeepingLessonNotesModel): Promise<AxiosResponse<Response<RecordKeepingDto>>> {
        let result = this.httpService
            .call()
            .patch<RecordKeepingDto, AxiosResponse<Response<RecordKeepingDto>>>(
                `/RecordKeeping/AddNote/${studentId}/${classId}/${lessonId}`, modal
            );

        return result;
    }    
}
