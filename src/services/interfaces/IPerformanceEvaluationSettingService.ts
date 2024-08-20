import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import PerformanceEvaluationSettingDto from "@/dtos/PerformanceEvaluationSettingDto";
import PerformanceEvaluationSettingModel from "@/models/PerformanceEvaluationSettingModel";
export default interface IPerformanceEvaluationSettingService {
  get(): Promise<AxiosResponse<Response<PerformanceEvaluationSettingDto>>>;
  getById(
    id: number
  ): Promise<AxiosResponse<Response<PerformanceEvaluationSettingDto>>>;
  save(
    model: PerformanceEvaluationSettingModel
  ): Promise<AxiosResponse<Response<PerformanceEvaluationSettingDto>>>;
  delete(
    id: number
  ): Promise<AxiosResponse<Response<PerformanceEvaluationSettingDto>>>;
}
