import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import IParentService from "./interfaces/IParentService";
import { ParentModel, ParentUpdateModel } from "@/models/ParentModel";
import { ParentDto, ParentListResponseDto } from "@/dtos/ParentDto";
import ParentListParams from "@/params/ParentListParams";
import RegistrationFeesDto from "@/dtos/RegistrationFeesDto";
import { ParentPaymentDto } from "@/dtos/ParentPaymentDto";

@injectable()
export default class ParentService implements IParentService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAll(
    p?: ParentListParams
  ): Promise<AxiosResponse<Response<ParentListResponseDto>>> {
    let result = this.httpService
      .call()
      .get<
        ParentListResponseDto,
        AxiosResponse<Response<ParentListResponseDto>>
      >(`/Parent`, {
        params: p,
      });

    return result;
  }

  getByParentId(parentId: number): Promise<AxiosResponse<Response<ParentDto>>> {
    let result = this.httpService
      .call()
      .get<ParentDto, AxiosResponse<Response<ParentDto>>>(
        `/Parent/${parentId}`
      );

    return result;
  }
  getParentPaymentDetailsByStudentId(studentId: number): Promise<AxiosResponse<Response<ParentPaymentDto>>> {
    let result = this.httpService
      .call()
      .get<ParentPaymentDto, AxiosResponse<Response<ParentPaymentDto>>>(
        `/Parent/GetParentPaymentDetailsByStudentId/${studentId}`
      );

    return result;
  }

  getParentPaymentDetails(): Promise<AxiosResponse<Response<RegistrationFeesDto>>> {
    let result = this.httpService
      .call()
      .get<RegistrationFeesDto, AxiosResponse<Response<RegistrationFeesDto>>>(
        `/Parent/GetParentPaymentDetails`
      );

    return result;
  }

  getByCurrentUserId(): Promise<AxiosResponse<Response<ParentDto>>> {
    let result = this.httpService
      .call()
      .get<ParentDto, AxiosResponse<Response<ParentDto>>>(
        `/Parent/GetCurrentParentDetails`
      );

    return result;
  }

  getSecondParentDetails(): Promise<AxiosResponse<Response<ParentDto>>> {
    let result = this.httpService
      .call()
      .get<ParentDto, AxiosResponse<Response<ParentDto>>>(
        `/Parent/GetSecondParentDetails`
      );

    return result;
  }

  add(model: ParentModel): Promise<AxiosResponse<Response<ParentDto>>> {
    let result = this.httpService
      .call()
      .post<ParentDto, AxiosResponse<Response<ParentDto>>>(`/Parent`, model);

    return result;
  }

  addSecondParent(
    model: FormData
  ): Promise<AxiosResponse<Response<ParentDto>>> {
    let result = this.httpService
      .call()
      .post<ParentDto, AxiosResponse<Response<ParentDto>>>(
        `/Parent/AddSecondParent`,
        model
      );

    return result;
  }

  update(model: FormData): Promise<AxiosResponse<Response<ParentDto>>> {
    let result = this.httpService
      .call()
      .put<ParentDto, AxiosResponse<Response<ParentDto>>>(`/Parent`, model);

    return result;
  }

  resendActivationEmail(
    parentId: number
  ): Promise<AxiosResponse<Response<ParentDto>>> {
    let result = this.httpService
      .call()
      .post<ParentDto, AxiosResponse<Response<ParentDto>>>(
        `/Parent/ResendActivationEmail/${parentId}`
      );

    return result;
  }

  activate(parentId: number): Promise<AxiosResponse<Response<ParentDto>>> {
    let result = this.httpService
      .call()
      .post<ParentDto, AxiosResponse<Response<ParentDto>>>(
        `/Parent/Activate/${parentId}`
      );

    return result;
  }

  deactivate(parentId: number): Promise<AxiosResponse<Response<ParentDto>>> {
    let result = this.httpService
      .call()
      .post<ParentDto, AxiosResponse<Response<ParentDto>>>(
        `/Parent/Deactivate/${parentId}`
      );

    return result;
  }

  getAllParentsByStudentId(
    studentId: number
  ): Promise<AxiosResponse<Response<ParentDto[]>>> {
    let result = this.httpService
      .call()
      .get<ParentDto[], AxiosResponse<Response<ParentDto[]>>>(
        `/Parent/GetAllParentsByStudentId/${studentId}`
      );

    return result;
  }

  updatePicture(model: FormData): Promise<AxiosResponse<Response<ParentDto>>> {
    let result = this.httpService
      .call()
      .put<ParentDto, AxiosResponse<Response<ParentDto>>>(`/Parent/UpdatePicture`, model);

    return result;
  }
}
