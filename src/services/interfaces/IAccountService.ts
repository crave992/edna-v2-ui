import LoginDto from "@/dtos/LoginDto";
import PlainDto from "@/dtos/PlainDto";
import LoginModel from "@/models/LoginModel";
import ForgetPasswordModel from "@/models/ForgetPasswordModel";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import ResetPasswordModel from "@/models/ResetPasswordModel";
import { ChangePasswordModel, NewAccountChangePasswordModel, VerifyPasswordModel } from "@/models/ChangePasswordModel";
import { UserStatusDto } from "@/dtos/UserDto";

export default interface IAccountService {
  login(model: LoginModel): Promise<AxiosResponse<Response<LoginDto>>>;

  forgotPassword(
    model: ForgetPasswordModel
  ): Promise<AxiosResponse<Response<PlainDto>>>;

  resetPassword(
    model: ResetPasswordModel
  ): Promise<AxiosResponse<Response<PlainDto>>>;

  changePassword(
    model: ChangePasswordModel
  ): Promise<AxiosResponse<Response<PlainDto>>>;

  newAccountChangePassword(
    model: NewAccountChangePasswordModel
  ): Promise<AxiosResponse<Response<PlainDto>>>;

  checkUserStatus(): Promise<AxiosResponse<Response<UserStatusDto>>>;

  verifyUserPassword(
    model: VerifyPasswordModel
  ): Promise<AxiosResponse<Response<PlainDto>>>;
}
