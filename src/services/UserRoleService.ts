import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import UserRoleModel from "@/models/UserRoleModel";
import IUserRoleService from "./interfaces/IUserRoleService";
import { UserRoleDto } from "@/dtos/UserRoleDto";

@injectable()
export default class UserRoleService implements IUserRoleService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getAll(q?: string): Promise<AxiosResponse<Response<UserRoleDto[]>>> {
        let result = this.httpService
            .call()
            .get<UserRoleDto[], AxiosResponse<Response<UserRoleDto[]>>>(
                `/UserRole?q=${q}`
            );

        return result;
    }

    getById(id: number): Promise<AxiosResponse<Response<UserRoleDto>>> {
        let result = this.httpService
            .call()
            .get<UserRoleDto, AxiosResponse<Response<UserRoleDto>>>(`/UserRole/${id}`);

        return result;
    }

    add(model: UserRoleModel): Promise<AxiosResponse<Response<UserRoleDto>>> {
        let result = this.httpService
            .call()
            .post<UserRoleDto, AxiosResponse<Response<UserRoleDto>>>(`/UserRole`, model);

        return result;
    }

    update(
        id: number,
        model: UserRoleModel
    ): Promise<AxiosResponse<Response<UserRoleDto>>> {
        let result = this.httpService
            .call()
            .put<UserRoleDto, AxiosResponse<Response<UserRoleDto>>>(
                `/UserRole/${id}`,
                model
            );

        return result;
    }

    delete(id: number): Promise<AxiosResponse<Response<UserRoleDto>>> {
        let result = this.httpService
            .call()
            .delete<UserRoleDto, AxiosResponse<Response<UserRoleDto>>>(
                `/UserRole/${id}`
            );

        return result;
    }
}
