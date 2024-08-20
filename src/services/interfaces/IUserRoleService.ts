import Response from "@/dtos/Response";
import { UserRoleDto } from "@/dtos/UserRoleDto";
import UserRoleModel from "@/models/UserRoleModel";
import { AxiosResponse } from "axios";

export default interface IUserRoleService {
    getAll(q?: string): Promise<AxiosResponse<Response<UserRoleDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<UserRoleDto>>>;
    add(model: UserRoleModel): Promise<AxiosResponse<Response<UserRoleDto>>>;
    update(id: number, model: UserRoleModel): Promise<AxiosResponse<Response<UserRoleDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<UserRoleDto>>>;
}
