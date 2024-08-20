import { injectable } from "inversify";
import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StaffEmploymentHistoryDto } from "@/dtos/StaffDto";
import { StaffEmploymentHistoryModel } from "@/models/StaffModel";
import IStaffEmploymentHistoryService from "./interfaces/IStaffEmploymentHistoryService";

@injectable()
export default class StaffEmploymentHistoryService implements IStaffEmploymentHistoryService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAllByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffEmploymentHistoryDto[]>>> {
    let result = this.httpService
      .call()
      .get<
      StaffEmploymentHistoryDto[],
        AxiosResponse<Response<StaffEmploymentHistoryDto[]>>
      >(`/StaffEmploymentHistory/GetByStaffId/${staffId}`);

    return result;
  }

  getAll(): Promise<AxiosResponse<Response<StaffEmploymentHistoryDto[]>>> {
    let result = this.httpService
      .call()
      .get<
      StaffEmploymentHistoryDto[],
        AxiosResponse<Response<StaffEmploymentHistoryDto[]>>
      >(`/StaffEmploymentHistory`);

    return result;
  }

  getById(id: number): Promise<AxiosResponse<Response<StaffEmploymentHistoryDto>>> {
    let result = this.httpService
      .call()
      .get<StaffEmploymentHistoryDto, AxiosResponse<Response<StaffEmploymentHistoryDto>>>(
        `/StaffEmploymentHistory/${id}`
      );

    return result;
  }

  add(model: StaffEmploymentHistoryModel): Promise<AxiosResponse<Response<StaffEmploymentHistoryDto>>> {
    let result = this.httpService
      .call()
      .post<StaffEmploymentHistoryDto, AxiosResponse<Response<StaffEmploymentHistoryDto>>>(
        `/StaffEmploymentHistory`,
        model
      );

    return result;
  }

  update(
    id: number,
    model: StaffEmploymentHistoryModel
  ): Promise<AxiosResponse<Response<StaffEmploymentHistoryDto>>> {
    let result = this.httpService
      .call()
      .put<StaffEmploymentHistoryDto, AxiosResponse<Response<StaffEmploymentHistoryDto>>>(
        `/StaffEmploymentHistory/${id}`,
        model
      );

    return result;
  }

  delete(id: number): Promise<AxiosResponse<Response<StaffEmploymentHistoryDto>>> {
    let result = this.httpService
      .call()
      .delete<StaffEmploymentHistoryDto, AxiosResponse<Response<StaffEmploymentHistoryDto>>>(
        `/StaffEmploymentHistory/${id}`
      );

    return result;
  }
}
