import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import IRoleManagementService from "./interfaces/IRoleManagementService";
import ModuleMappingWithUserRoleDto from "@/dtos/ModuleMappingWithUserRoleDto";
import { ModuleMappingWithUserRoleModel } from "@/models/ModuleMappingWithUserRoleModel";

@injectable()
export default class RoleManagementService implements IRoleManagementService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getByUserRoleId(roleId: number): Promise<AxiosResponse<Response<ModuleMappingWithUserRoleDto[]>>> {
        let result = this.httpService
            .call()
            .get<ModuleMappingWithUserRoleDto[], AxiosResponse<Response<ModuleMappingWithUserRoleDto[]>>>(
                `/RoleManagement/GetByUserRoleId/${roleId}`
            );

        return result;
    }
    
    save(roleId: number, model: ModuleMappingWithUserRoleModel[]): Promise<AxiosResponse<Response<ModuleMappingWithUserRoleDto>>> {
        let result = this.httpService
            .call()
            .post<ModuleMappingWithUserRoleDto, AxiosResponse<Response<ModuleMappingWithUserRoleDto>>>(`/RoleManagement/SaveMapping/${roleId}`, model);

        return result;
    }
}
