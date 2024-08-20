import { TYPES } from "@/config/types";
import IUserService from "./interfaces/IUserService";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";

import UserBasicDto from "@/dtos/UserDto";
import UserDto from "@/dtos/UserDto";

import Response from "@/dtos/Response";
import { CustomTimeZoneDto } from "@/dtos/CustomTimeZoneDto";

@injectable()
export default class UserService implements IUserService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getUser(userId: string): Promise<AxiosResponse<Response<UserDto>>> {
    let result = this.httpService
      .call()
      .get<UserDto, AxiosResponse<Response<UserDto>>>(`/User?userId=${userId}`);

    return result;
  }

  getByUserName(username: string): Promise<AxiosResponse<Response<UserDto>>> {
    let result = this.httpService
      .call()
      .get<UserDto, AxiosResponse<Response<UserDto>>>(`/User/GetByUserName?username=${username}`);

    return result;
  }

  getCurrentUser(): Promise<AxiosResponse<Response<UserDto>>> {
    let result = this.httpService
      .call()
      .get<UserDto, AxiosResponse<Response<UserDto>>>(`/User/GetCurrentUser`);

    return result;
  }

  getAllUsers(): Promise<AxiosResponse<Response<UserBasicDto[]>>> {
    let result = this.httpService
      .call()
      .get<UserDto, AxiosResponse<Response<UserBasicDto[]>>>(`/User/GetAllUsers`);

    return result;
  }

  getTimeZones(): Promise<AxiosResponse<Response<CustomTimeZoneDto[]>>> {
    let result = this.httpService
      .call()
      .get<CustomTimeZoneDto[], AxiosResponse<Response<CustomTimeZoneDto[]>>>(`/TimeZone`);

    return result;
  }
}
