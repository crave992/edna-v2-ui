import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import ModuleMappingWithUserRoleDto from "@/dtos/ModuleMappingWithUserRoleDto";
import { ModuleMappingWithUserRoleModel } from "@/models/ModuleMappingWithUserRoleModel";

export default interface IRoleManagementService {
  getByUserRoleId(roleId: number): Promise<AxiosResponse<Response<ModuleMappingWithUserRoleDto[]>>>;  
  save(roleId: number, model: ModuleMappingWithUserRoleModel[]): Promise<AxiosResponse<Response<ModuleMappingWithUserRoleDto>>>;
}
