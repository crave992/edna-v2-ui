import { injectable } from "inversify";
import IJobTitleService from "./interfaces/IJobTitleService";
import { JobTitleDto, JobTitleListResponseDto } from "@/dtos/JobTitleDto";
import Response from "@/dtos/Response";
import JobTitleModel from "@/models/JobTitleModel";
import { AxiosResponse } from "axios";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import JobTitleListParams from "@/params/JobTitleListParams";

@injectable()
export default class JobTitleService implements IJobTitleService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAll(
    p: JobTitleListParams
  ): Promise<AxiosResponse<Response<JobTitleListResponseDto>>> {
    let result = this.httpService
      .call()
      .get<
        JobTitleListResponseDto,
        AxiosResponse<Response<JobTitleListResponseDto>>
      >(`/JobTitle`, {
        params: p,
      });

    return result;
  }

  getById(id: number): Promise<AxiosResponse<Response<JobTitleDto>>> {
    let result = this.httpService
      .call()
      .get<JobTitleDto, AxiosResponse<Response<JobTitleDto>>>(
        `/JobTitle/${id}`
      );

    return result;
  }

  getAllForDropDown(): Promise<AxiosResponse<Response<JobTitleDto[]>>> {
    let result = this.httpService
      .call()
      .get<JobTitleDto[], AxiosResponse<Response<JobTitleDto[]>>>(
        `/JobTitle/GetAllForDropdown`
      );

    return result;
  }

  add(model: JobTitleModel): Promise<AxiosResponse<Response<JobTitleDto>>> {
    let result = this.httpService
      .call()
      .post<JobTitleDto, AxiosResponse<Response<JobTitleDto>>>(
        `/JobTitle`,
        model
      );

    return result;
  }

  update(
    id: number,
    model: JobTitleModel
  ): Promise<AxiosResponse<Response<JobTitleDto>>> {
    let result = this.httpService
      .call()
      .put<JobTitleDto, AxiosResponse<Response<JobTitleDto>>>(
        `/JobTitle/${id}`,
        model
      );

    return result;
  }

  delete(id: number): Promise<AxiosResponse<Response<JobTitleDto>>> {
    let result = this.httpService
      .call()
      .delete<JobTitleDto, AxiosResponse<Response<JobTitleDto>>>(
        `/JobTitle/${id}`
      );

    return result;
  }
}
