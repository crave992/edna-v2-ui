import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import { PickupDropoffParentDto } from "@/dtos/PickupDropoffParentDto";
import IPickupDropOffParentService from "./interfaces/IPickupDropOffParentService";
import PickupDropoffConfigDto from "@/dtos/PickupDropoffConfigDto";
import { PickupAuthorizationEmergencyContactConsentDto } from "@/dtos/PickupAuthorizationEmergencyContactConsentDto";
import { PickupAuthorizationEmergencyContactConsentModel } from "@/models/PickupAuthorizationEmergencyContactConsentModel";

@injectable()
export default class PickupDropoffParentService
  implements IPickupDropOffParentService
{
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAllByParentId(
    parentId: number
  ): Promise<AxiosResponse<Response<PickupDropoffParentDto[]>>> {
    let result = this.httpService
      .call()
      .get<
        PickupDropoffParentDto[],
        AxiosResponse<Response<PickupDropoffParentDto[]>>
      >(`/PickupDropoff/GetAllByParentId/${parentId}`);

    return result;
  }

  getAllByParentIdAndStudnetId(
    parentId: number,
    studentId: number
  ): Promise<AxiosResponse<Response<PickupDropoffParentDto[]>>> {
    let result = this.httpService
      .call()
      .get<
        PickupDropoffParentDto[],
        AxiosResponse<Response<PickupDropoffParentDto[]>>
      >(`/PickupDropoff/GetAllByParentIdAndStudnetId/${parentId}/${studentId}`);

    return result;
  }

  getContactsByStudentId(
    studentId: number
  ): Promise<AxiosResponse<Response<PickupDropoffParentDto[]>>> {
    let result = this.httpService
      .call()
      .get<
        PickupDropoffParentDto[],
        AxiosResponse<Response<PickupDropoffParentDto[]>>
      >(`/PickupDropoff/GetAuthorizeContactsByStudentId/${studentId}`);

    return result;
  }

  getDropOffConfig(): Promise<AxiosResponse<Response<PickupDropoffConfigDto>>> {
    let result = this.httpService
      .call()
      .get<
        PickupDropoffConfigDto,
        AxiosResponse<Response<PickupDropoffConfigDto>>
      >(`/PickupDropoff/GetDropOffConfig`);

    return result;
  }

  getById(
    id: number
  ): Promise<AxiosResponse<Response<PickupDropoffParentDto>>> {
    let result = this.httpService
      .call()
      .get<
        PickupDropoffParentDto,
        AxiosResponse<Response<PickupDropoffParentDto>>
      >(`/PickupDropoff/GetById/${id}`);

    return result;
  }

  add(
    model: FormData
  ): Promise<AxiosResponse<Response<PickupDropoffParentDto>>> {
    let result = this.httpService
      .call()
      .post<
        PickupDropoffParentDto,
        AxiosResponse<Response<PickupDropoffParentDto>>
      >(`/PickupDropoff`, model);

    return result;
  }

  update(
    id: number,
    model: FormData
  ): Promise<AxiosResponse<Response<PickupDropoffParentDto>>> {
    let result = this.httpService
      .call()
      .put<
        PickupDropoffParentDto,
        AxiosResponse<Response<PickupDropoffParentDto>>
      >(`/PickupDropoff/${id}`, model);

    return result;
  }

  delete(id: number): Promise<AxiosResponse<Response<PickupDropoffParentDto>>> {
    let result = this.httpService
      .call()
      .delete<
        PickupDropoffParentDto,
        AxiosResponse<Response<PickupDropoffParentDto>>
      >(`/PickupDropoff/${id}`);

    return result;
  }

  getConsentByParentId(
    parentId: number
  ): Promise<
    AxiosResponse<Response<PickupAuthorizationEmergencyContactConsentDto>>
  > {
    let result = this.httpService
      .call()
      .get<
        PickupAuthorizationEmergencyContactConsentDto,
        AxiosResponse<Response<PickupAuthorizationEmergencyContactConsentDto>>
      >(`/PickupDropoff/GetConsentByParentId/${parentId}`);

    return result;
  }

  saveConsent(
    model: PickupAuthorizationEmergencyContactConsentModel
  ): Promise<
    AxiosResponse<Response<PickupAuthorizationEmergencyContactConsentDto>>
  > {
    let result = this.httpService
      .call()
      .post<
        PickupAuthorizationEmergencyContactConsentDto,
        AxiosResponse<Response<PickupAuthorizationEmergencyContactConsentDto>>
      >(`/PickupDropoff/SaveConsent`, model);

    return result;
  }
}
