import Response from "@/dtos/Response";
import StateDto, { StateListResponseDto } from "@/dtos/StateDto";
import StateModel from "@/models/StateModel";
import StateListParams from "@/params/StateListParams";
import { AxiosResponse } from "axios";

export default interface IStateService {
  getAll(p: StateListParams): Promise<AxiosResponse<Response<StateListResponseDto>>>;
  getAllForDropDown(): Promise<AxiosResponse<Response<StateListResponseDto>>>;
  getById(id: number): Promise<AxiosResponse<Response<StateDto>>>;
  getByCode(code: string): Promise<AxiosResponse<Response<StateDto>>>;
  getByName(name: string): Promise<AxiosResponse<Response<StateDto>>>;
  getByCountryCode(countryCode: string): Promise<AxiosResponse<Response<StateDto[]>>>;
  getByCountryId(countryId: number): Promise<AxiosResponse<Response<StateDto[]>>>;
  add(model: StateModel): Promise<AxiosResponse<Response<StateDto>>>;
  update(id: number, model: StateModel): Promise<AxiosResponse<Response<StateDto>>>;
  delete(id: number): Promise<AxiosResponse<Response<StateDto>>>;
}
