import { injectable } from "inversify";
import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import IPerformanceEvaluationSettingService from "./interfaces/IPerformanceEvaluationSettingService";
import PerformanceEvaluationSettingDto from "@/dtos/PerformanceEvaluationSettingDto";
import PerformanceEvaluationSettingModel from "@/models/PerformanceEvaluationSettingModel";

@injectable()
export default class PerformanceEvaluationSettingService
  implements IPerformanceEvaluationSettingService
{
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  get(): Promise<AxiosResponse<Response<PerformanceEvaluationSettingDto>>> {
    let result = this.httpService
      .call()
      .get<
        PerformanceEvaluationSettingDto,
        AxiosResponse<Response<PerformanceEvaluationSettingDto>>
      >(`/PerformanceEvaluationSetting`);

    return result;
  }

  getById(
    id: number
  ): Promise<AxiosResponse<Response<PerformanceEvaluationSettingDto>>> {
    let result = this.httpService
      .call()
      .get<
        PerformanceEvaluationSettingDto,
        AxiosResponse<Response<PerformanceEvaluationSettingDto>>
      >(`/PerformanceEvaluationSetting/${id}`);

    return result;
  }

  save(
    model: PerformanceEvaluationSettingModel
  ): Promise<AxiosResponse<Response<PerformanceEvaluationSettingDto>>> {
    let result = this.httpService
      .call()
      .post<
        PerformanceEvaluationSettingDto,
        AxiosResponse<Response<PerformanceEvaluationSettingDto>>
      >(`/PerformanceEvaluationSetting`, model);

    return result;
  }

  delete(
    id: number
  ): Promise<AxiosResponse<Response<PerformanceEvaluationSettingDto>>> {
    let result = this.httpService
      .call()
      .delete<
        PerformanceEvaluationSettingDto,
        AxiosResponse<Response<PerformanceEvaluationSettingDto>>
      >(`/PerformanceEvaluationSetting/${id}`);

    return result;
  }
}
