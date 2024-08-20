import { TYPES } from "@/config/types";
import ICountryService from "./interfaces/ICountryService";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import CountryModel from "@/models/CountryModel";
import CountryDto from "@/dtos/CountryDto";

@injectable()
export default class CountryService implements ICountryService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAll(q?: string): Promise<AxiosResponse<Response<CountryDto[]>>> {
    let result = this.httpService
      .call()
      .get<CountryDto[], AxiosResponse<Response<CountryDto[]>>>(
        `/Country?q=${q}`
      );

    return result;
  }

  getById(id: number): Promise<AxiosResponse<Response<CountryDto>>> {
    let result = this.httpService
      .call()
      .get<CountryDto, AxiosResponse<Response<CountryDto>>>(`/Country/${id}`);

    return result;
  }

  add(model: CountryModel): Promise<AxiosResponse<Response<CountryDto>>> {
    let result = this.httpService
      .call()
      .post<CountryDto, AxiosResponse<Response<CountryDto>>>(`/Country`, model);

    return result;
  }

  update(
    id: number,
    model: CountryModel
  ): Promise<AxiosResponse<Response<CountryDto>>> {
    let result = this.httpService
      .call()
      .put<CountryDto, AxiosResponse<Response<CountryDto>>>(
        `/Country/${id}`,
        model
      );

    return result;
  }

  delete(id: number): Promise<AxiosResponse<Response<CountryDto>>> {
    let result = this.httpService
      .call()
      .delete<CountryDto, AxiosResponse<Response<CountryDto>>>(
        `/Country/${id}`
      );

    return result;
  }
}
