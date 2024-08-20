import { injectable } from "inversify";
import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import IStaffDegreeService from "./interfaces/IStaffDegreeService";
import { StaffDegreeDto } from "@/dtos/StaffDto";
import { StaffDegreeModel } from "@/models/StaffModel";

@injectable()
export default class StaffDegreeService implements IStaffDegreeService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAllByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffDegreeDto[]>>> {
    let result = this.httpService
      .call()
      .get<
      StaffDegreeDto[],
        AxiosResponse<Response<StaffDegreeDto[]>>
      >(`/StaffDegree/GetByStaffId/${staffId}`);

    return result;
  }

  getAll(): Promise<AxiosResponse<Response<StaffDegreeDto[]>>> {
    let result = this.httpService
      .call()
      .get<
      StaffDegreeDto[],
        AxiosResponse<Response<StaffDegreeDto[]>>
      >(`/StaffDegree`);

    return result;
  }

  getById(id: number): Promise<AxiosResponse<Response<StaffDegreeDto>>> {
    let result = this.httpService
      .call()
      .get<StaffDegreeDto, AxiosResponse<Response<StaffDegreeDto>>>(
        `/StaffDegree/${id}`
      );

    return result;
  }

  add(model: StaffDegreeModel): Promise<AxiosResponse<Response<StaffDegreeDto>>> {
    let result = this.httpService
      .call()
      .post<StaffDegreeDto, AxiosResponse<Response<StaffDegreeDto>>>(
        `/StaffDegree`,
        model
      );

    return result;
  }

  update(
    id: number,
    model: StaffDegreeModel
  ): Promise<AxiosResponse<Response<StaffDegreeDto>>> {
    let result = this.httpService
      .call()
      .put<StaffDegreeDto, AxiosResponse<Response<StaffDegreeDto>>>(
        `/StaffDegree/${id}`,
        model
      );

    return result;
  }

  delete(id: number): Promise<AxiosResponse<Response<StaffDegreeDto>>> {
    let result = this.httpService
      .call()
      .delete<StaffDegreeDto, AxiosResponse<Response<StaffDegreeDto>>>(
        `/StaffDegree/${id}`
      );

    return result;
  }
}
