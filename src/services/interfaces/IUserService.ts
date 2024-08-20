import { CustomTimeZoneDto } from "@/dtos/CustomTimeZoneDto";
import Response from "@/dtos/Response";
import UserDto from "@/dtos/UserDto";
import UserBasicDto from "@/dtos/UserDto";

import { AxiosResponse } from "axios";

export default interface IUserService {
  getUser(userId: string): Promise<AxiosResponse<Response<UserDto>>>;
  getByUserName(username: string): Promise<AxiosResponse<Response<UserDto>>>;
  getCurrentUser(): Promise<AxiosResponse<Response<UserDto>>>;
  getAllUsers(): Promise<AxiosResponse<Response<UserBasicDto[]>>>;
  getTimeZones(): Promise<AxiosResponse<Response<CustomTimeZoneDto[]>>>;
}