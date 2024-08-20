import { TYPES } from "@/config/types";
import IAreaService from "./interfaces/IAreaService";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import axios, { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import AreaListParams from "@/params/AreaListParams";
import AreaDto, { AreaListResponseDto } from "@/dtos/AreaDto";
import AreaModel from "@/models/AreaModel";
import PlainDto from "@/dtos/PlainDto";

@injectable()
export default class AreaService implements IAreaService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAll(
    p: AreaListParams
  ): Promise<AxiosResponse<Response<AreaListResponseDto>>> {
    let result = this.httpService
      .call()
      .get<AreaListResponseDto, AxiosResponse<Response<AreaListResponseDto>>>(
        `/Area`,
        {
          params: p,
        }
      );

    return result;
  }
  getAllArea(p: AreaListParams): Promise<AxiosResponse<Response<AreaDto[]>>> {
    let result = this.httpService
      .call()
      .get<AreaListResponseDto, AxiosResponse<Response<AreaDto[]>>>(
        `/Area/GetAllArea`,
        {
          params: p,
        }
      );

    return result;
  }

  getAreaByLevel(levelId: number): Promise<AxiosResponse<Response<AreaDto[]>>> {
    let result = this.httpService
      .call()
      .get<AreaDto[], AxiosResponse<Response<AreaDto[]>>>(
        `/Area/GetAreaByLevel/${levelId}`
      );

    return result;
  }

  getAllAreas(
    p: AreaListResponseDto
  ): Promise<AxiosResponse<Response<AreaListResponseDto>>> {
    let result = this.httpService
      .call()
      .get<AreaListResponseDto, AxiosResponse<Response<AreaListResponseDto>>>(
        `/Area/GetWithoutLogin`,
        {
          params: p,
        }
      );

    return result;
  }

  getAllForDropDown(): Promise<AxiosResponse<Response<AreaListResponseDto>>> {
    let result = this.httpService
      .call()
      .get<AreaListResponseDto, AxiosResponse<Response<AreaListResponseDto>>>(
        `/Area/GetAreaDropdown`
      );

    return result;
  }

  getById(id: number): Promise<AxiosResponse<Response<AreaDto>>> {
    let result = this.httpService
      .call()
      .get<AreaDto, AxiosResponse<Response<AreaDto>>>(`/Area/${id}`);

    return result;
  }

  // getByCode(code: string): Promise<AxiosResponse<Response<AreaDto>, any>> {
  //     let result = this.httpService
  //         .call()
  //         .get<AreaDto, AxiosResponse<Response<AreaDto>>>(`/State/GetByCode/${code}`);

  //     return result;
  // }

  getByName(name: string): Promise<AxiosResponse<Response<AreaDto>, any>> {
    let result = this.httpService
      .call()
      .get<AreaDto, AxiosResponse<Response<AreaDto>>>(
        `/Area/GetByName/${name}`
      );

    return result;
  }

  // getByCountryCode(countryCode: string): Promise<AxiosResponse<Response<AreaDto[]>, any>> {
  //     let result = this.httpService
  //         .call()
  //         .get<AreaDto[], AxiosResponse<Response<AreaDto[]>>>(`/Area/GetByCountryCode/${countryCode}`);

  //     return result;
  // }

  getByLevelId(
    levelId: number
  ): Promise<AxiosResponse<Response<AreaDto[]>, any>> {
    let result = this.httpService
      .call()
      .get<AreaDto[], AxiosResponse<Response<AreaDto[]>>>(
        `/Area/GetByLevelId/${levelId}`
      );

    return result;
  }

  add(model: AreaModel): Promise<AxiosResponse<Response<AreaDto>>> {
    let result = this.httpService
      .call()
      .post<AreaDto, AxiosResponse<Response<AreaDto>>>(`/Area`, model);

    return result;
  }

  postMultipleArea(model: AreaModel[]): Promise<AxiosResponse<Response<PlainDto>>> {
    let result = this.httpService
      .call()
      .post<PlainDto, AxiosResponse<Response<PlainDto>>>(`/Area/PostMultipleArea`, model);

    return result;
  }

  update(
    id: number,
    model: AreaModel
  ): Promise<AxiosResponse<Response<AreaDto>>> {
    let result = this.httpService
      .call()
      .put<AreaDto, AxiosResponse<Response<AreaDto>>>(`/Area/${id}`, model);

    return result;
  }

  delete(id: number): Promise<AxiosResponse<Response<AreaDto>>> {
    let result = this.httpService
      .call()
      .delete<AreaDto, AxiosResponse<Response<AreaDto>>>(`/Area/${id}`);

    return result;
  }
}
