import { TYPES } from "@/config/types";
import IAccountService from "./interfaces/IAccountService";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import LoginModel from "@/models/LoginModel";
import ForgetPasswordModel from "@/models/ForgetPasswordModel";
import { AxiosResponse } from "axios";
import LoginDto from "@/dtos/LoginDto";
import PlainDto from "@/dtos/PlainDto";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import ResetPasswordModel from "@/models/ResetPasswordModel";
import { ChangePasswordModel, NewAccountChangePasswordModel, VerifyPasswordModel } from "@/models/ChangePasswordModel";
import { UserStatusDto } from "@/dtos/UserDto";

@injectable()
export default class AccountService implements IAccountService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  async login(model: LoginModel): Promise<AxiosResponse<Response<LoginDto>>> {
    let result = this.httpService
      .callWithoutInterceptor()
      .post<LoginDto, AxiosResponse<Response<LoginDto>>>(
        "/Account/Login",
        model
      );

    return result;
  }

  async forgotPassword(
    model: ForgetPasswordModel
  ): Promise<AxiosResponse<Response<PlainDto>>> {
    let result = this.httpService
      .callWithoutInterceptor()
      .post<PlainDto, AxiosResponse<Response<PlainDto>>>(
        "/Account/ForgotPassword",
        model
      );

    return result;
  }

  async resetPassword(
    model: ResetPasswordModel
  ): Promise<AxiosResponse<Response<PlainDto>>> {
    let result = this.httpService
      .callWithoutInterceptor()
      .post<PlainDto, AxiosResponse<Response<PlainDto>>>(
        "/Account/ResetPassword",
        model
      );

    return result;
  }

  async changePassword(
    model: ChangePasswordModel
  ): Promise<AxiosResponse<Response<PlainDto>>> {
    let result = this.httpService
      .call()
      .post<PlainDto, AxiosResponse<Response<PlainDto>>>(
        "/Account/ChangePassword",
        model
      );

    return result;
  }

  async newAccountChangePassword(
    model: NewAccountChangePasswordModel
  ): Promise<AxiosResponse<Response<PlainDto>>> {
    let result = this.httpService
      .call()
      .post<PlainDto, AxiosResponse<Response<PlainDto>>>(
        "/Account/NewAccountChangePassword",
        model
      );

    return result;
  }

  async checkUserStatus(): Promise<AxiosResponse<Response<UserStatusDto>>> {
    const result = this.httpService
      .call()
      .get<UserStatusDto, AxiosResponse<Response<UserStatusDto>>>("/Account/CheckUserStatus");

    return result;
  }

  async verifyUserPassword(
    model: VerifyPasswordModel
  ): Promise<AxiosResponse<Response<PlainDto>>> {
    let result = this.httpService
      .call()
      .post<PlainDto, AxiosResponse<Response<PlainDto>>>(
        "/Account/VerifyUserPassword",
        model
      );

    return result;
  }
}
