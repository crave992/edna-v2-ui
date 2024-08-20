import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import { OrganizationDto, OrganizationTypeDto } from "@/dtos/OrganizationDto";
import { OrganizationModel } from "@/models/OrganizationModel";
import IOrganizationService from "./interfaces/IOrganizationService";

@injectable()
export default class OrganizationService implements IOrganizationService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAll(q?: string): Promise<AxiosResponse<Response<OrganizationDto[]>>> {
    let result = this.httpService
      .call()
      .get<OrganizationDto[], AxiosResponse<Response<OrganizationDto[]>>>(
        `/Organization?q=${q}`
      );

    return result;
  }

  getById(id: number): Promise<AxiosResponse<Response<OrganizationDto>>> {
    let result = this.httpService
      .call()
      .get<OrganizationDto, AxiosResponse<Response<OrganizationDto>>>(
        `/Organization/${id}`
      );

    return result;
  }
  getAllOrganizationType(): Promise<
    AxiosResponse<Response<OrganizationTypeDto[]>>
  > {
    let result = this.httpService
      .call()
      .get<
        OrganizationTypeDto[],
        AxiosResponse<Response<OrganizationTypeDto[]>>
      >(`/OrganizationType`);

    return result;
  }

  getByCurrentUserId(): Promise<AxiosResponse<Response<OrganizationDto>>> {
    let result = this.httpService
      .call()
      .get<OrganizationDto, AxiosResponse<Response<OrganizationDto>>>(
        `/Organization/GetByCurrentUserId`
      );

    return result;
  }

  checkSubDomain(
    subdomain: string
  ): Promise<AxiosResponse<Response<OrganizationDto>>> {
    let result = this.httpService
      .call()
      .get<OrganizationDto, AxiosResponse<Response<OrganizationDto>>>(
        `/Organization/CheckSubDomain/${subdomain}`
      );

    return result;
  }

  add(
    model: OrganizationModel
  ): Promise<AxiosResponse<Response<OrganizationDto>>> {
    let result = this.httpService
      .call()
      .post<OrganizationDto, AxiosResponse<Response<OrganizationDto>>>(
        `/Organization`,
        model
      );

    return result;
  }

  update(model: FormData): Promise<AxiosResponse<Response<OrganizationDto>>> {
    let result = this.httpService
      .call()
      .put<OrganizationDto, AxiosResponse<Response<OrganizationDto>>>(
        `/Organization`,
        model
      );

    return result;
  }

  activate(
    organizationId: number
  ): Promise<AxiosResponse<Response<OrganizationDto>>> {
    let result = this.httpService
      .call()
      .post<OrganizationDto, AxiosResponse<Response<OrganizationDto>>>(
        `/Organization/Activate/${organizationId}`
      );

    return result;
  }

  deactivate(
    organizationId: number
  ): Promise<AxiosResponse<Response<OrganizationDto>>> {
    let result = this.httpService
      .call()
      .post<OrganizationDto, AxiosResponse<Response<OrganizationDto>>>(
        `/Organization/Deactivate/${organizationId}`
      );

    return result;
  }

  updatePicture(model: FormData): Promise<AxiosResponse<Response<OrganizationDto>>> {
    let result = this.httpService
      .call()
      .put<OrganizationDto, AxiosResponse<Response<OrganizationDto>>>(`/Organization/UpdatePicture`, model);

    return result;
  }
}
