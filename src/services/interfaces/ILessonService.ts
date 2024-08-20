import Response from "@/dtos/Response";
import LessonDto, {LessonListResponseDto, LessonRecordKeepingBasicDto, LessonReportsListResponseDto} from "@/dtos/LessonDto";
import LessonModel, { AssignStudentInLessonModel } from "@/models/LessonModel";
import { AxiosResponse } from "axios";
import LessonListParams, { LessonReportsListParams } from "@/params/LessonListParams";
import PlainDto from "@/dtos/PlainDto";

export default interface ILessonService {
    getAll(p: LessonListParams): Promise<AxiosResponse<Response<LessonListResponseDto>>>;
    getById(id: number): Promise<AxiosResponse<Response<LessonDto>>>;
    getByLevelAreaAndTopic(levelId: number, areaId: number, topicId: number, q: string): Promise<AxiosResponse<Response<LessonDto[]>>>;
    getByLevelAreaAndTopicAndClass(levelId: number, areaId: number, topicId: number, classId: number, q: string): Promise<AxiosResponse<Response<LessonDto[]>>>;
    getByLevelAreaAndTopicAndClassAndStudentId(levelId: number, areaId: number, topicId: number, classId: number, studentId: number, q: string): Promise<AxiosResponse<Response<LessonDto[]>>>;
    getByStudentId(studentId: number, p?: LessonListParams): Promise<AxiosResponse<Response<LessonDto[]>>>;
    getByClassId(classId: number): Promise<AxiosResponse<Response<LessonRecordKeepingBasicDto[]>>>;
    getGraphByStudentId(studentId: number): Promise<AxiosResponse<Response<LessonRecordKeepingBasicDto[]>>>;
    assignStudentInLesson(model: AssignStudentInLessonModel): Promise<AxiosResponse<Response<PlainDto>>>;
    removeStudentFromLesson(model: AssignStudentInLessonModel): Promise<AxiosResponse<Response<PlainDto>>>;
    add(model: LessonModel): Promise<AxiosResponse<Response<LessonDto>>>;
    postMultipleLesson(model: LessonModel[]): Promise<AxiosResponse<Response<PlainDto>>>;
    update(id: number, model: LessonModel): Promise<AxiosResponse<Response<LessonDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<LessonDto>>>;

    getReportByStudent(p: LessonReportsListParams): Promise<AxiosResponse<Response<LessonReportsListResponseDto>>>;
}
