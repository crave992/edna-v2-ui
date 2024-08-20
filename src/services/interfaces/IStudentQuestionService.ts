import Response from "@/dtos/Response";
import StudentQuestionDto from "@/dtos/StudentQuestionDto";
import StudentQuestionModel from "@/models/StudentQuestionModel";
import { AxiosResponse } from "axios";

export default interface IStudentQuestionService {
    getAll(q?: string, levelId?: number): Promise<AxiosResponse<Response<StudentQuestionDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<StudentQuestionDto>>>;
    add(model: StudentQuestionModel): Promise<AxiosResponse<Response<StudentQuestionDto>>>;
    update(id: number, model: StudentQuestionModel): Promise<AxiosResponse<Response<StudentQuestionDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<StudentQuestionDto>>>;
}