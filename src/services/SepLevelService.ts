import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import axios, { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import SepLevelModel from "@/models/SepLevelModel";
import SepLevelListParams from "@/params/SepLevelListParams";
import SepLevelDto, { SepLevelListResponseDto } from "@/dtos/SepLevelDto";
import ISepLevelService from "./interfaces/ISepLevelService";
import PlainDto from "@/dtos/PlainDto";

@injectable()
export default class SepLevelService implements ISepLevelService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAll(
    p: SepLevelListParams
  ): Promise<AxiosResponse<Response<SepLevelListResponseDto>>> {
    let result = this.httpService
      .call()
      .get<
        SepLevelListResponseDto,
        AxiosResponse<Response<SepLevelListResponseDto>>
      >(`/SepLevel`, {
        params: p,
      });

    return result;
  }
  getAllSepLevel(
    p: SepLevelListParams
  ): Promise<AxiosResponse<Response<SepLevelDto[]>>> {
    let result = this.httpService
      .call()
      .get<SepLevelListResponseDto, AxiosResponse<Response<SepLevelDto[]>>>(
        `/SepLevel/GetAllAsync`,
        {
          params: p,
        }
      );

    return result;
  }
  getLevelByLevelAndArea(levelId: number, sepAreaId: number): Promise<AxiosResponse<Response<SepLevelDto[]>>> {

    let result = this.httpService
      .call()
      .get<SepLevelDto[], AxiosResponse<Response<SepLevelDto[]>>>(`/SepLevel/GetLevelByLevelAndArea/${levelId}/${sepAreaId}`, {});

    return result;
  }
  
  getAllLevels(
    p: SepLevelListResponseDto
  ): Promise<AxiosResponse<Response<SepLevelListResponseDto>>> {
    let result = this.httpService
      .call()
      .get<
        SepLevelListResponseDto,
        AxiosResponse<Response<SepLevelListResponseDto>>
      >(`/SepLevel/GetWithoutLogin`, {
        params: p,
      });

    return result;
  }

  getAllForDropDown(): Promise<AxiosResponse<Response<SepLevelDto[]>>> {
    let result = this.httpService
      .call()
      .get<SepLevelDto[], AxiosResponse<Response<SepLevelDto[]>>>(
        `/SepLevel/GetAllForDropDown`
      );

    return result;
  }

  getById(id: number): Promise<AxiosResponse<Response<SepLevelDto>>> {
    let result = this.httpService
      .call()
      .get<SepLevelDto, AxiosResponse<Response<SepLevelDto>>>(
        `/SepLevel/${id}`
      );

    return result;
  }

  getByName(name: string): Promise<AxiosResponse<Response<SepLevelDto>, any>> {
    let result = this.httpService
      .call()
      .get<SepLevelDto, AxiosResponse<Response<SepLevelDto>>>(
        `/SepLevel/GetByName/${name}`
      );

    return result;
  }

  getByLevelId(
    levelId: number
  ): Promise<AxiosResponse<Response<SepLevelDto[]>, any>> {
    let result = this.httpService
      .call()
      .get<SepLevelDto[], AxiosResponse<Response<SepLevelDto[]>>>(
        `/SepLevel/GetByLevelId/${levelId}`
      );

    return result;
  }
  getBySepAreaId(
    levelId: number
  ): Promise<AxiosResponse<Response<SepLevelDto[]>, any>> {
    let result = this.httpService
      .call()
      .get<SepLevelDto[], AxiosResponse<Response<SepLevelDto[]>>>(
        `/SepLevel/GetByLevelId/${levelId}`
      );

    return result;
  }

  add(model: SepLevelModel): Promise<AxiosResponse<Response<SepLevelDto>>> {
    let result = this.httpService
      .call()
      .post<SepLevelDto, AxiosResponse<Response<SepLevelDto>>>(
        `/SepLevel`,
        model
      );

    return result;
  }
  
  postMultipleSepLevel(model: SepLevelModel[]): Promise<AxiosResponse<Response<PlainDto>>> {
    let result = this.httpService
      .call()
      .post<PlainDto, AxiosResponse<Response<PlainDto>>>(`/SepLevel/PostMultipleSepLevel`, model);

    return result;
  }


  update(
    id: number,
    model: SepLevelModel
  ): Promise<AxiosResponse<Response<SepLevelDto>>> {
    let result = this.httpService
      .call()
      .put<SepLevelDto, AxiosResponse<Response<SepLevelDto>>>(
        `/SepLevel/${id}`,
        model
      );

    return result;
  }

  delete(id: number): Promise<AxiosResponse<Response<SepLevelDto>>> {
    let result = this.httpService
      .call()
      .delete<SepLevelDto, AxiosResponse<Response<SepLevelDto>>>(
        `/SepLevel/${id}`
      );

    return result;
  }
}
