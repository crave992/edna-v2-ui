import Response from "@/dtos/Response";
import StaffPerformanceEvaluationDto, {
  StaffPerformanceEvaluationListResponseDto,
} from "@/dtos/StaffPerformanceEvaluationDto";
import StaffPerformanceEvaluationModel from "@/models/StaffPerformanceEvaluationModel";
import PaginationParams from "@/params/PaginationParams";
import { AxiosResponse } from "axios";

export default interface IStaffPerformanceEvaluationService {
  getAllByStaffId(
    staffId: number,
    p?: PaginationParams
  ): Promise<
    AxiosResponse<Response<StaffPerformanceEvaluationListResponseDto>>
  >;
  getById(id: number): Promise<AxiosResponse<Response<StaffPerformanceEvaluationDto>>>;
  getByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffPerformanceEvaluationDto[]>>>;
  add(
    model: StaffPerformanceEvaluationModel
  ): Promise<AxiosResponse<Response<StaffPerformanceEvaluationDto>>>;
  update(
    id: number,
    model: StaffPerformanceEvaluationModel
  ): Promise<AxiosResponse<Response<StaffPerformanceEvaluationDto>>>;
  delete(
    id: number
  ): Promise<AxiosResponse<Response<StaffPerformanceEvaluationDto>>>;
}
