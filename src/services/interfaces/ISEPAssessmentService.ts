import Response from "@/dtos/Response";
import { SEPAssessmentDto, SEPAssessmentHistoryDto } from "@/dtos/SEPAssessmentDto";
import { SepTopicAssessmentDto } from "@/dtos/SepTopicDto";
import SEPAssessmentModel from "@/models/SEPAssessmentModel";
import { AxiosResponse } from "axios";

export default interface ISEPAssessmentService {
    getSepTopicsForAssessment(studentId: number, classId: number, levelId: number, sepAreaId: number, sepLevelId: number): Promise<AxiosResponse<Response<SepTopicAssessmentDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<SEPAssessmentDto>>>;
    getHistory(sepAssessmentId: number, studentId: number, classId: number, sepTopicId: number): Promise<AxiosResponse<Response<SEPAssessmentHistoryDto[]>>>;
    save(studentId: number, classId: number, sepTopicId: number, model: SEPAssessmentModel): Promise<AxiosResponse<Response<SEPAssessmentDto>>>;    
}
