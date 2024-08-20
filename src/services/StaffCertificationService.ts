import { injectable } from "inversify";
import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StaffCertificationDto } from "@/dtos/StaffDto";
import { StaffCertificationModel } from "@/models/StaffModel";
import IStaffCertificationService from "./interfaces/IStaffCertificationService";

@injectable()
export default class StaffCertificationService implements IStaffCertificationService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAllByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffCertificationDto[]>>> {
    let result = this.httpService
      .call()
      .get<
      StaffCertificationDto[],
        AxiosResponse<Response<StaffCertificationDto[]>>
      >(`/StaffCertification/GetByStaffId/${staffId}`);

    return result;
  }

  getAll(): Promise<AxiosResponse<Response<StaffCertificationDto[]>>> {
    let result = this.httpService
      .call()
      .get<
      StaffCertificationDto[],
        AxiosResponse<Response<StaffCertificationDto[]>>
      >(`/StaffCertification`);

    return result;
  }

  getById(id: number): Promise<AxiosResponse<Response<StaffCertificationDto>>> {
    let result = this.httpService
      .call()
      .get<StaffCertificationDto, AxiosResponse<Response<StaffCertificationDto>>>(
        `/StaffCertification/${id}`
      );

    return result;
  }

  add(model: StaffCertificationModel): Promise<AxiosResponse<Response<StaffCertificationDto>>> {
    let result = this.httpService
      .call()
      .post<StaffCertificationDto, AxiosResponse<Response<StaffCertificationDto>>>(
        `/StaffCertification`,
        model
      );

    return result;
  }

  update(
    id: number,
    model: StaffCertificationModel
  ): Promise<AxiosResponse<Response<StaffCertificationDto>>> {
    let result = this.httpService
      .call()
      .put<StaffCertificationDto, AxiosResponse<Response<StaffCertificationDto>>>(
        `/StaffCertification/${id}`,
        model
      );

    return result;
  }

  delete(id: number): Promise<AxiosResponse<Response<StaffCertificationDto>>> {
    let result = this.httpService
      .call()
      .delete<StaffCertificationDto, AxiosResponse<Response<StaffCertificationDto>>>(
        `/StaffCertification/${id}`
      );

    return result;
  }
}
