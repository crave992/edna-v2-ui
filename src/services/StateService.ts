import { TYPES } from "@/config/types";
import IStateService from "./interfaces/IStateService";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import axios, { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import StateListParams from "@/params/StateListParams";
import StateDto, { StateListResponseDto } from "@/dtos/StateDto";
import StateModel from "@/models/StateModel";

@injectable()
export default class StateService implements IStateService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAll(p: StateListParams): Promise<AxiosResponse<Response<StateListResponseDto>>> {
    let result = this.httpService
      .call()
      .get<StateListResponseDto, AxiosResponse<Response<StateListResponseDto>>>(`/State`, {
        params: p
      });

    return result;
  }

  getAllStates(p: StateListParams): Promise<AxiosResponse<Response<StateListResponseDto>>> {

    let result = this.httpService
      .call()
      .get<StateListResponseDto, AxiosResponse<Response<StateListResponseDto>>>(`/State/GetWithoutLogin`, {
        params: p
      });

    return result;
  }

  getAllForDropDown(): Promise<AxiosResponse<Response<StateListResponseDto>>> {
    let result = this.httpService
      .call()
      .get<StateListResponseDto, AxiosResponse<Response<StateListResponseDto>>>(
        `/State/GetStateDropdown`
      );

    return result;
  }

  getById(id: number): Promise<AxiosResponse<Response<StateDto>>> {
    let result = this.httpService
      .call()
      .get<StateDto, AxiosResponse<Response<StateDto>>>(`/State/${id}`);

    return result;
  }

  getByCode(code: string): Promise<AxiosResponse<Response<StateDto>, any>> {
    let result = this.httpService
      .call()
      .get<StateDto, AxiosResponse<Response<StateDto>>>(`/State/GetByCode/${code}`);

    return result;
  }

  getByName(name: string): Promise<AxiosResponse<Response<StateDto>, any>> {
    let result = this.httpService
      .call()
      .get<StateDto, AxiosResponse<Response<StateDto>>>(`/State/GetByName/${name}`);

    return result;
  }

  getByCountryCode(countryCode: string): Promise<AxiosResponse<Response<StateDto[]>, any>> {
    let result = this.httpService
      .call()
      .get<StateDto[], AxiosResponse<Response<StateDto[]>>>(`/State/GetByCountryCode/${countryCode}`);

    return result;
  }

  getByCountryId(countryId: number): Promise<AxiosResponse<Response<StateDto[]>, any>> {
    let result = this.httpService
      .call()
      .get<StateDto[], AxiosResponse<Response<StateDto[]>>>(`/State/GetByCountryId/${countryId}`);

    return result;
  }

  add(model: StateModel): Promise<AxiosResponse<Response<StateDto>>> {
    let result = this.httpService
      .call()
      .post<StateDto, AxiosResponse<Response<StateDto>>>(`/State`, model);

    return result;
  }

  update(id: number, model: StateModel): Promise<AxiosResponse<Response<StateDto>>> {
    let result = this.httpService
      .call()
      .put<StateDto, AxiosResponse<Response<StateDto>>>(`/State/${id}`, model);

    return result;
  }

  delete(id: number): Promise<AxiosResponse<Response<StateDto>>> {
    let result = this.httpService
      .call()
      .delete<StateDto, AxiosResponse<Response<StateDto>>>(`/State/${id}`);

    return result;
  }
}
