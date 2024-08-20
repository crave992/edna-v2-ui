import CountryDto from "@/dtos/CountryDto";
import Response from "@/dtos/Response";
import CountryModel from "@/models/CountryModel";
import { AxiosResponse } from "axios";

export default interface ICountryService {
  getAll(q?: string): Promise<AxiosResponse<Response<CountryDto[]>>>;
  getById(id: number): Promise<AxiosResponse<Response<CountryDto>>>;
  add(model: CountryModel): Promise<AxiosResponse<Response<CountryDto>>>;
  update(
    id: number,
    model: CountryModel
  ): Promise<AxiosResponse<Response<CountryDto>>>;
  delete(id: number): Promise<AxiosResponse<Response<CountryDto>>>;
}
