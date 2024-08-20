import { container } from "@/config/ioc";
import IHttpService from "./interfaces/IHttpService";
import { TYPES } from "@/config/types";
import Response from "@/dtos/Response";
import IPickupDropOffConfigurationService from "./interfaces/IPickupDropOffConfigurationService";
import PickupDropoffConfigDto from "@/dtos/PickupDropoffConfigDto";
import { AxiosResponse } from "axios";
import PickupDropOffConfigurationModel from "@/models/PickupDropOffConfigModel";
import { injectable } from "inversify";

@injectable()
export default class PickupDropOffConfigurationService
  implements IPickupDropOffConfigurationService
{
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAll(): Promise<AxiosResponse<Response<PickupDropoffConfigDto[]>>> {
    let result = this.httpService
      .call()
      .get<
        PickupDropoffConfigDto[],
        AxiosResponse<Response<PickupDropoffConfigDto[]>>
      >(`/PickupDropoffConfig`);

    return result;
  }

  getById(
    id: number
  ): Promise<AxiosResponse<Response<PickupDropoffConfigDto>>> {
    let result = this.httpService
      .call()
      .get<
        PickupDropoffConfigDto,
        AxiosResponse<Response<PickupDropoffConfigDto>>
      >(`/PickupDropoffConfig/${id}`);

    return result;
  }

  add(
    model: PickupDropOffConfigurationModel
  ): Promise<AxiosResponse<Response<PickupDropoffConfigDto>>> {
    let result = this.httpService
      .call()
      .post<
        PickupDropoffConfigDto,
        AxiosResponse<Response<PickupDropoffConfigDto>>
      >(`/PickupDropoffConfig`, model);

    return result;
  }

  update(
    id: number,
    model: PickupDropOffConfigurationModel
  ): Promise<AxiosResponse<Response<PickupDropoffConfigDto>>> {
    let result = this.httpService
      .call()
      .put<
        PickupDropoffConfigDto,
        AxiosResponse<Response<PickupDropoffConfigDto>>
      >(`/PickupDropoffConfig/${id}`, model);

    return result;
  }

  delete(id: number): Promise<AxiosResponse<Response<PickupDropoffConfigDto>>> {
    let result = this.httpService
      .call()
      .delete<
        PickupDropoffConfigDto,
        AxiosResponse<Response<PickupDropoffConfigDto>>
      >(`/PickupDropoffConfig/${id}`);

    return result;
  }

  getOrganizationId(): Promise<
    AxiosResponse<Response<PickupDropoffConfigDto>>
  > {
    let result = this.httpService
      .call()
      .get<
        PickupDropoffConfigDto,
        AxiosResponse<Response<PickupDropoffConfigDto>>
      >(`/PickupDropoffConfig/GetOrganizationId`);

    return result;
  }
}
