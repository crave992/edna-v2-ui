import { injectable } from "inversify";
import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StaffReferenceDto } from "@/dtos/StaffDto";
import { StaffReferenceModel } from "@/models/StaffModel";
import IStaffReferenceService from "./interfaces/IStaffReferenceService";

@injectable()
export default class StaffReferenceService implements IStaffReferenceService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAllByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffReferenceDto[]>>> {
    let result = this.httpService
      .call()
      .get<
      StaffReferenceDto[],
        AxiosResponse<Response<StaffReferenceDto[]>>
      >(`/StaffReference/GetByStaffId/${staffId}`);

    return result;
  }

  getAll(): Promise<AxiosResponse<Response<StaffReferenceDto[]>>> {
    let result = this.httpService
      .call()
      .get<
      StaffReferenceDto[],
        AxiosResponse<Response<StaffReferenceDto[]>>
      >(`/StaffReference`);

    return result;
  }

  getById(id: number): Promise<AxiosResponse<Response<StaffReferenceDto>>> {
    let result = this.httpService
      .call()
      .get<StaffReferenceDto, AxiosResponse<Response<StaffReferenceDto>>>(
        `/StaffReference/${id}`
      );

    return result;
  }

  add(model: StaffReferenceModel): Promise<AxiosResponse<Response<StaffReferenceDto>>> {
    let result = this.httpService
      .call()
      .post<StaffReferenceDto, AxiosResponse<Response<StaffReferenceDto>>>(
        `/StaffReference`,
        model
      );

    return result;
  }

  update(
    id: number,
    model: StaffReferenceModel
  ): Promise<AxiosResponse<Response<StaffReferenceDto>>> {
    let result = this.httpService
      .call()
      .put<StaffReferenceDto, AxiosResponse<Response<StaffReferenceDto>>>(
        `/StaffReference/${id}`,
        model
      );

    return result;
  }

  delete(id: number): Promise<AxiosResponse<Response<StaffReferenceDto>>> {
    let result = this.httpService
      .call()
      .delete<StaffReferenceDto, AxiosResponse<Response<StaffReferenceDto>>>(
        `/StaffReference/${id}`
      );

    return result;
  }
}
