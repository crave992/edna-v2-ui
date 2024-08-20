import { injectable } from "inversify";
import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StaffProfessionalDevelopmentDto } from "@/dtos/StaffDto";
import { StaffProfessionalDevelopmentModel } from "@/models/StaffModel";
import IStaffProfessionalDevelopmentService from "./interfaces/IStaffProfessionalDevelopmentService";

@injectable()
export default class StaffProfessionalDevelopmentService implements IStaffProfessionalDevelopmentService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAllByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffProfessionalDevelopmentDto[]>>> {
    let result = this.httpService
      .call()
      .get<
      StaffProfessionalDevelopmentDto[],
        AxiosResponse<Response<StaffProfessionalDevelopmentDto[]>>
      >(`/StaffProfessionalDevelopment/GetByStaffId/${staffId}`);

    return result;
  }

  getAll(): Promise<AxiosResponse<Response<StaffProfessionalDevelopmentDto[]>>> {
    let result = this.httpService
      .call()
      .get<
      StaffProfessionalDevelopmentDto[],
        AxiosResponse<Response<StaffProfessionalDevelopmentDto[]>>
      >(`/StaffProfessionalDevelopment`);

    return result;
  }

  getById(id: number): Promise<AxiosResponse<Response<StaffProfessionalDevelopmentDto>>> {
    let result = this.httpService
      .call()
      .get<StaffProfessionalDevelopmentDto, AxiosResponse<Response<StaffProfessionalDevelopmentDto>>>(
        `/StaffProfessionalDevelopment/${id}`
      );

    return result;
  }

  add(model: StaffProfessionalDevelopmentModel): Promise<AxiosResponse<Response<StaffProfessionalDevelopmentDto>>> {
    let result = this.httpService
      .call()
      .post<StaffProfessionalDevelopmentDto, AxiosResponse<Response<StaffProfessionalDevelopmentDto>>>(
        `/StaffProfessionalDevelopment`,
        model
      );

    return result;
  }

  update(
    id: number,
    model: StaffProfessionalDevelopmentModel
  ): Promise<AxiosResponse<Response<StaffProfessionalDevelopmentDto>>> {
    let result = this.httpService
      .call()
      .put<StaffProfessionalDevelopmentDto, AxiosResponse<Response<StaffProfessionalDevelopmentDto>>>(
        `/StaffProfessionalDevelopment/${id}`,
        model
      );

    return result;
  }

  delete(id: number): Promise<AxiosResponse<Response<StaffProfessionalDevelopmentDto>>> {
    let result = this.httpService
      .call()
      .delete<StaffProfessionalDevelopmentDto, AxiosResponse<Response<StaffProfessionalDevelopmentDto>>>(
        `/StaffProfessionalDevelopment/${id}`
      );

    return result;
  }
}
