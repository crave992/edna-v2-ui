import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import PickupDropoffConfigDto from "@/dtos/PickupDropoffConfigDto";
import PickupDropOffConfigurationModel from "@/models/PickupDropOffConfigModel";

export default interface IPickupDropOffConfigurationService {
  getAll(): Promise<AxiosResponse<Response<PickupDropoffConfigDto[]>>>;
  getById(id: number): Promise<AxiosResponse<Response<PickupDropoffConfigDto>>>;
  add(
    model: PickupDropOffConfigurationModel
  ): Promise<AxiosResponse<Response<PickupDropoffConfigDto>>>;
  update(
    id: number,
    model: PickupDropOffConfigurationModel
  ): Promise<AxiosResponse<Response<PickupDropoffConfigDto>>>;
  delete(id: number): Promise<AxiosResponse<Response<PickupDropoffConfigDto>>>;

  getOrganizationId(): Promise<AxiosResponse<Response<PickupDropoffConfigDto>>>;
}
