import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import LessonDto, { LessonListResponseDto, LessonRecordKeepingBasicDto, LessonReportsListResponseDto } from "@/dtos/LessonDto";
import LessonListParams, { LessonReportsListParams } from "@/params/LessonListParams";
import ILessonService from "./interfaces/ILessonService";
import LessonModel, { AssignStudentInLessonModel } from "@/models/LessonModel";
import PlainDto from "@/dtos/PlainDto";

@injectable()
export default class LessonService implements ILessonService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(p: LessonListParams): Promise<AxiosResponse<Response<LessonListResponseDto>>> {
        let result = this.httpService
            .call()
            .get<LessonListResponseDto, AxiosResponse<Response<LessonListResponseDto>>>(`/Lesson`, {
                params: p
            });

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<LessonDto>>> {
        let result = this.httpService
            .call()
            .get<LessonDto, AxiosResponse<Response<LessonDto>>>(`/Lesson/${id}`);

        return result;
    }

    getByLevelAreaAndTopic(levelId: number, areaId: number, topicId: number, q: string): Promise<AxiosResponse<Response<LessonDto[]>>> {
        let result = this.httpService
            .call()
            .get<LessonDto[], AxiosResponse<Response<LessonDto[]>>>(`/Lesson/GetByLevelAreaAndTopic/${levelId}/${areaId}/${topicId}?q=${q}`);

        return result;
    }

    getByLevelAreaAndTopicAndClass(levelId: number, areaId: number, topicId: number, classId: number, q: string): Promise<AxiosResponse<Response<LessonDto[]>>> {
        let result = this.httpService
            .call()
            .get<LessonDto[], AxiosResponse<Response<LessonDto[]>>>(`/Lesson/GetByLevelAreaAndTopicAndClass/${levelId}/${areaId}/${topicId}/${classId}?q=${q}`);

        return result;
    }

    getByLevelAreaAndTopicAndClassAndStudentId(levelId: number, areaId: number, topicId: number, classId: number, studentId: number, q: string): Promise<AxiosResponse<Response<LessonDto[]>>> {
        let result = this.httpService
            .call()
            .get<LessonDto[], AxiosResponse<Response<LessonDto[]>>>(`/Lesson/GetByLevelAreaAndTopicAndClassAndStudentId/${levelId}/${areaId}/${topicId}/${classId}/${studentId}?q=${q}`);

        return result;
    }

    getByStudentId(studentId: number, p?: LessonListParams): Promise<AxiosResponse<Response<LessonDto[]>>> {
        let result = this.httpService
            .call()
            .get<LessonDto[], AxiosResponse<Response<LessonDto[]>>>(`/Lesson/GetByStudentId/${studentId}`, {
                params: p
            });

        return result;
    }
    
    
    getByClassId(classId: number): Promise<AxiosResponse<Response<LessonRecordKeepingBasicDto[]>>> {
        let result = this.httpService
            .call()
            .get<LessonRecordKeepingBasicDto[], AxiosResponse<Response<LessonRecordKeepingBasicDto[]>>>(`/Lesson/GetByClassId/${classId}`);

        return result;
    }

    getGraphByStudentId(studentId: number): Promise<AxiosResponse<Response<LessonRecordKeepingBasicDto[]>>> {
        let result = this.httpService
            .call()
            .get<LessonRecordKeepingBasicDto[], AxiosResponse<Response<LessonRecordKeepingBasicDto[]>>>(`/Lesson/GetGraphByStudentId/${studentId}`);

        return result;
    }
    
    assignStudentInLesson(model: AssignStudentInLessonModel): Promise<AxiosResponse<Response<PlainDto>>> {
        let result = this.httpService
            .call()
            .post<PlainDto, AxiosResponse<Response<PlainDto>>>(`/LessonAssignment/AssignStudentInLesson`, model);

        return result;
    }
    
    
    removeStudentFromLesson(model: AssignStudentInLessonModel): Promise<AxiosResponse<Response<PlainDto>>> {
        let result = this.httpService
            .call()
            .post<PlainDto, AxiosResponse<Response<PlainDto>>>(`/LessonAssignment/RemoveStudentFromLesson`, model);

        return result;
    }

    add(model: LessonModel): Promise<AxiosResponse<Response<LessonDto>>> {
        let result = this.httpService
            .call()
            .post<LessonDto, AxiosResponse<Response<LessonDto>>>(`/Lesson`, model);

        return result;
    }

    postMultipleLesson(model: LessonModel[]): Promise<AxiosResponse<Response<PlainDto>>> {
        let result = this.httpService
            .call()
            .post<PlainDto, AxiosResponse<Response<PlainDto>>>(`/Lesson/PostMultipleLesson`, model);

        return result;
    }

    update(id: number, model: LessonModel): Promise<AxiosResponse<Response<LessonDto>>> {
        let result = this.httpService
            .call()
            .put<LessonDto, AxiosResponse<Response<LessonDto>>>(`/Lesson/${id}`, model);

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<LessonDto>>> {
        let result = this.httpService
            .call()
            .delete<LessonDto, AxiosResponse<Response<LessonDto>>>(`/Lesson/${id}`);

        return result;
    }

    getReportByStudent(p: LessonReportsListParams): Promise<AxiosResponse<Response<LessonReportsListResponseDto>>> {
        let result = this.httpService
            .call()
            .get<LessonReportsListResponseDto, AxiosResponse<Response<LessonReportsListResponseDto>>>(`/Lesson/GetReportByStudent`, {
                params: p
            });

        return result;
    }
}
