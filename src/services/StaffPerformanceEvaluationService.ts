import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import IStaffPerformanceEvaluationService from "./interfaces/IStaffPerformanceEvaluationService";
import StaffPerformanceEvaluationModel from "@/models/StaffPerformanceEvaluationModel";
import StaffPerformanceEvaluationDto, {
  StaffPerformanceEvaluationListResponseDto,
} from "@/dtos/StaffPerformanceEvaluationDto";
import PaginationParams from "@/params/PaginationParams";

@injectable()
export default class StaffPerformanceEvaluationService
  implements IStaffPerformanceEvaluationService
{
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAllByStaffId(
    staffId: number,
    p?: PaginationParams
  ): Promise<
    AxiosResponse<Response<StaffPerformanceEvaluationListResponseDto>>
  > {
    let result = this.httpService
      .call()
      .get<
        StaffPerformanceEvaluationListResponseDto,
        AxiosResponse<Response<StaffPerformanceEvaluationListResponseDto>>
      >(`/StaffPerformanceEvaluation/GetAllByStaffId/${staffId}`, {
        params: p,
      });

    return result;
  }

  getById(
    id: number
  ): Promise<AxiosResponse<Response<StaffPerformanceEvaluationDto>>> {
    let result = this.httpService
      .call()
      .get<
        StaffPerformanceEvaluationDto,
        AxiosResponse<Response<StaffPerformanceEvaluationDto>>
      >(`/StaffPerformanceEvaluation/${id}`);

    return result;
  }
  getByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffPerformanceEvaluationDto[]>>> {
    let result = this.httpService
      .call()
      .get<
        StaffPerformanceEvaluationDto[],
        AxiosResponse<Response<StaffPerformanceEvaluationDto[]>>
      >(`/StaffPerformanceEvaluation/GetByStaffId/${staffId}`);

    return result;
  }

  add(
    model: StaffPerformanceEvaluationModel
  ): Promise<AxiosResponse<Response<StaffPerformanceEvaluationDto>>> {
    let result = this.httpService
      .call()
      .post<
        StaffPerformanceEvaluationDto,
        AxiosResponse<Response<StaffPerformanceEvaluationDto>>
      >(`/StaffPerformanceEvaluation`, model);

    return result;
  }

  update(
    id: number,
    model: StaffPerformanceEvaluationModel
  ): Promise<AxiosResponse<Response<StaffPerformanceEvaluationDto>>> {
    let result = this.httpService
      .call()
      .put<
        StaffPerformanceEvaluationDto,
        AxiosResponse<Response<StaffPerformanceEvaluationDto>>
      >(`/StaffPerformanceEvaluation/${id}`, model);

    return result;
  }

  delete(
    id: number
  ): Promise<AxiosResponse<Response<StaffPerformanceEvaluationDto>>> {
    let result = this.httpService
      .call()
      .delete<
        StaffPerformanceEvaluationDto,
        AxiosResponse<Response<StaffPerformanceEvaluationDto>>
      >(`/StaffPerformanceEvaluation/${id}`);

    return result;
  }
}
