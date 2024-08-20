import { TYPES } from "@/config/types";
import ISepAreaService from "./interfaces/ISepAreaService";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import axios, { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import SepAreaListParams from "@/params/SepAreaListParams";
import SepAreaDto, { SepAreaListResponseDto } from "@/dtos/SepAreaDto";
import SepAreaModel from "@/models/SepAreaModel";
import PlainDto from "@/dtos/PlainDto";

@injectable()
export default class AreaService implements ISepAreaService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAll(
    p: SepAreaListParams
  ): Promise<AxiosResponse<Response<SepAreaListResponseDto>>> {
    let result = this.httpService
      .call()
      .get<
        SepAreaListResponseDto,
        AxiosResponse<Response<SepAreaListResponseDto>>
      >(`/SepArea`, {
        params: p,
      });

    return result;
  }
  getAllSepArea(
    p: SepAreaListParams
  ): Promise<AxiosResponse<Response<SepAreaDto[]>>> {
    let result = this.httpService
      .call()
      .get<SepAreaListResponseDto, AxiosResponse<Response<SepAreaDto[]>>>(
        `/SepArea/GetAllArea`,
        {
          params: p,
        }
      );

    return result;
  }


  getAreaByLevel(levelId: number): Promise<AxiosResponse<Response<SepAreaDto[]>>> {
    let result = this.httpService
      .call()
      .get<SepAreaDto[], AxiosResponse<Response<SepAreaDto[]>>>(
        `/SepArea/GetAreaByLevel/${levelId}`
      );

    return result;
  }

  getAllAreas(
    p: SepAreaListResponseDto
  ): Promise<AxiosResponse<Response<SepAreaListResponseDto>>> {
    let result = this.httpService
      .call()
      .get<
        SepAreaListResponseDto,
        AxiosResponse<Response<SepAreaListResponseDto>>
      >(`/SepArea/GetWithoutLogin`, {
        params: p,
      });

    return result;
  }

  getAllForDropDown(): Promise<AxiosResponse<Response<SepAreaDto[]>>> {
    let result = this.httpService
      .call()
      .get<SepAreaDto, AxiosResponse<Response<SepAreaDto[]>>>(
        `/SepArea/GetAllForDropDown`
      );

    return result;
  }

  getById(id: number): Promise<AxiosResponse<Response<SepAreaDto>>> {
    let result = this.httpService
      .call()
      .get<SepAreaDto, AxiosResponse<Response<SepAreaDto>>>(`/SepArea/${id}`);

    return result;
  }

  getByName(name: string): Promise<AxiosResponse<Response<SepAreaDto>, any>> {
    let result = this.httpService
      .call()
      .get<SepAreaDto, AxiosResponse<Response<SepAreaDto>>>(
        `/SepArea/GetByName/${name}`
      );

    return result;
  }

  getByLevelId(
    levelId: number
  ): Promise<AxiosResponse<Response<SepAreaDto[]>, any>> {
    let result = this.httpService
      .call()
      .get<SepAreaDto[], AxiosResponse<Response<SepAreaDto[]>>>(
        `/SepArea/GetByLevelId/${levelId}`
      );

    return result;
  }

  add(model: SepAreaModel): Promise<AxiosResponse<Response<SepAreaDto>>> {
    let result = this.httpService
      .call()
      .post<SepAreaDto, AxiosResponse<Response<SepAreaDto>>>(`/SepArea`, model);

    return result;
  }

  postMultipleSepArea(model: SepAreaModel[]): Promise<AxiosResponse<Response<PlainDto>>> {
    let result = this.httpService
      .call()
      .post<PlainDto, AxiosResponse<Response<PlainDto>>>(`/SepArea/PostMultipleSepArea`, model);

    return result;
  }

  update(
    id: number,
    model: SepAreaModel
  ): Promise<AxiosResponse<Response<SepAreaDto>>> {
    let result = this.httpService
      .call()
      .put<SepAreaDto, AxiosResponse<Response<SepAreaDto>>>(
        `/SepArea/${id}`,
        model
      );

    return result;
  }

  delete(id: number): Promise<AxiosResponse<Response<SepAreaDto>>> {
    let result = this.httpService
      .call()
      .delete<SepAreaDto, AxiosResponse<Response<SepAreaDto>>>(
        `/SepArea/${id}`
      );

    return result;
  }
}
