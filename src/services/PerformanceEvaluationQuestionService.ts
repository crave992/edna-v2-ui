import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import IPerformanceEvaluationQuestionService from "./interfaces/IPerformanceEvaluationQuestionService";
import PerformanceEvaluationQuestionDto from "@/dtos/PerformanceEvaluationQuestionDto";
import PerformanceEvaluationQuestionModel from "@/models/PerformanceEvaluationQuestionModel";
import PerformanceEvaluationMappingQuestionDto from "@/dtos/PerformanceEvaluationMappingQuestionDto";

@injectable()
export default class PerformanceEvaluationQuestionService
  implements IPerformanceEvaluationQuestionService
{
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAll(
    q?: string
  ): Promise<AxiosResponse<Response<PerformanceEvaluationQuestionDto[]>>> {
    let result = this.httpService
      .call()
      .get<
        PerformanceEvaluationQuestionDto[],
        AxiosResponse<Response<PerformanceEvaluationQuestionDto[]>>
      >(`/PerformanceEvaluationQuestion?q=${q}`);

    return result;
  }

  getById(
    id: number
  ): Promise<AxiosResponse<Response<PerformanceEvaluationQuestionDto>>> {
    let result = this.httpService
      .call()
      .get<
        PerformanceEvaluationQuestionDto,
        AxiosResponse<Response<PerformanceEvaluationQuestionDto>>
      >(`/PerformanceEvaluationQuestion/${id}`);

    return result;
  }

  getPerformanceEvaluationMappingQuestions(
    staffPerformanceEvaluationId: number
  ): Promise<
    AxiosResponse<Response<PerformanceEvaluationMappingQuestionDto[]>>
  > {
    let result = this.httpService
      .call()
      .get<
        PerformanceEvaluationMappingQuestionDto[],
        AxiosResponse<Response<PerformanceEvaluationMappingQuestionDto[]>>
      >(
        `/PerformanceEvaluationQuestion/GetPerformanceEvaluationMappingQuestions/${staffPerformanceEvaluationId}`
      );

    return result;
  }

  add(
    model: PerformanceEvaluationQuestionModel
  ): Promise<AxiosResponse<Response<PerformanceEvaluationQuestionDto>>> {
    let result = this.httpService
      .call()
      .post<
        PerformanceEvaluationQuestionDto,
        AxiosResponse<Response<PerformanceEvaluationQuestionDto>>
      >(`/PerformanceEvaluationQuestion`, model);

    return result;
  }

  update(
    id: number,
    model: PerformanceEvaluationQuestionModel
  ): Promise<AxiosResponse<Response<PerformanceEvaluationQuestionDto>>> {
    let result = this.httpService
      .call()
      .put<
        PerformanceEvaluationQuestionDto,
        AxiosResponse<Response<PerformanceEvaluationQuestionDto>>
      >(`/PerformanceEvaluationQuestion/${id}`, model);

    return result;
  }

  delete(
    id: number
  ): Promise<AxiosResponse<Response<PerformanceEvaluationQuestionDto>>> {
    let result = this.httpService
      .call()
      .delete<
        PerformanceEvaluationQuestionDto,
        AxiosResponse<Response<PerformanceEvaluationQuestionDto>>
      >(`/PerformanceEvaluationQuestion/${id}`);

    return result;
  }
}
