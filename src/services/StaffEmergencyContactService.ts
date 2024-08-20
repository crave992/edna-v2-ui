import { injectable } from "inversify";
import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { TYPES } from "@/config/types";
import { StaffEmergencyContactDto } from "@/dtos/StaffDto";
import { StaffEmergencyContactModel } from "@/models/StaffModel";
import IStaffEmergencyContactService from "./interfaces/IStaffEmergencyContactService";

@injectable()
export default class StaffEmergencyContactService implements IStaffEmergencyContactService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAllByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffEmergencyContactDto[]>>> {
    let result = this.httpService
      .call()
      .get<
      StaffEmergencyContactDto[],
        AxiosResponse<Response<StaffEmergencyContactDto[]>>
      >(`/StaffEmergencyContact/GetByStaffId/${staffId}`);

    return result;
  }

  getAll(): Promise<AxiosResponse<Response<StaffEmergencyContactDto[]>>> {
    let result = this.httpService
      .call()
      .get<
      StaffEmergencyContactDto[],
        AxiosResponse<Response<StaffEmergencyContactDto[]>>
      >(`/StaffEmergencyContact`);

    return result;
  }

  getById(id: number): Promise<AxiosResponse<Response<StaffEmergencyContactDto>>> {
    let result = this.httpService
      .call()
      .get<StaffEmergencyContactDto, AxiosResponse<Response<StaffEmergencyContactDto>>>(
        `/StaffEmergencyContact/${id}`
      );

    return result;
  }

  add(model: StaffEmergencyContactModel): Promise<AxiosResponse<Response<StaffEmergencyContactDto>>> {
    let result = this.httpService
      .call()
      .post<StaffEmergencyContactDto, AxiosResponse<Response<StaffEmergencyContactDto>>>(
        `/StaffEmergencyContact`,
        model
      );

    return result;
  }

  update(
    id: number,
    model: StaffEmergencyContactModel
  ): Promise<AxiosResponse<Response<StaffEmergencyContactDto>>> {
    let result = this.httpService
      .call()
      .put<StaffEmergencyContactDto, AxiosResponse<Response<StaffEmergencyContactDto>>>(
        `/StaffEmergencyContact/${id}`,
        model
      );

    return result;
  }

  delete(id: number): Promise<AxiosResponse<Response<StaffEmergencyContactDto>>> {
    let result = this.httpService
      .call()
      .delete<StaffEmergencyContactDto, AxiosResponse<Response<StaffEmergencyContactDto>>>(
        `/StaffEmergencyContact/${id}`
      );

    return result;
  }
}
