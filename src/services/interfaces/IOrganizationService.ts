import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { OrganizationDto, OrganizationTypeDto } from "@/dtos/OrganizationDto";
import { OrganizationModel } from "@/models/OrganizationModel";

export default interface IOrganizationService {
  getAll(q?: string): Promise<AxiosResponse<Response<OrganizationDto[]>>>;
  getAllOrganizationType(): Promise<
    AxiosResponse<Response<OrganizationTypeDto[]>>
  >;
  getById(id: number): Promise<AxiosResponse<Response<OrganizationDto>>>;
  getByCurrentUserId(): Promise<AxiosResponse<Response<OrganizationDto>>>;
  checkSubDomain(
    subdomain: string
  ): Promise<AxiosResponse<Response<OrganizationDto>>>;
  add(
    model: OrganizationModel
  ): Promise<AxiosResponse<Response<OrganizationDto>>>;

  update(model: FormData): Promise<AxiosResponse<Response<OrganizationDto>>>;

  activate(
    organizationId: number
  ): Promise<AxiosResponse<Response<OrganizationDto>>>;
  deactivate(
    organizationId: number
  ): Promise<AxiosResponse<Response<OrganizationDto>>>;
  updatePicture(model: FormData): Promise<AxiosResponse<Response<OrganizationDto>>>;
}
