import PerformanceEvaluationMappingQuestionDto from "@/dtos/PerformanceEvaluationMappingQuestionDto";
import PerformanceEvaluationQuestionDto from "@/dtos/PerformanceEvaluationQuestionDto";
import Response from "@/dtos/Response";
import PerformanceEvaluationQuestionModel from "@/models/PerformanceEvaluationQuestionModel";
import { AxiosResponse } from "axios";

export default interface IPerformanceEvaluationQuestionService {
  getAll(
    q?: string
  ): Promise<AxiosResponse<Response<PerformanceEvaluationQuestionDto[]>>>;
  getById(
    id: number
  ): Promise<AxiosResponse<Response<PerformanceEvaluationQuestionDto>>>;
  getPerformanceEvaluationMappingQuestions(
    staffPerformanceEvaluationId: number
  ): Promise<
    AxiosResponse<Response<PerformanceEvaluationMappingQuestionDto[]>>
  >;
  add(
    model: PerformanceEvaluationQuestionModel
  ): Promise<AxiosResponse<Response<PerformanceEvaluationQuestionDto>>>;
  update(
    id: number,
    model: PerformanceEvaluationQuestionModel
  ): Promise<AxiosResponse<Response<PerformanceEvaluationQuestionDto>>>;
  delete(
    id: number
  ): Promise<AxiosResponse<Response<PerformanceEvaluationQuestionDto>>>;
}
