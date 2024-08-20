import PlainDto from "@/dtos/PlainDto";
import Response from "@/dtos/Response";
import SepLevelDto, { SepLevelListResponseDto } from "@/dtos/SepLevelDto";
import SepLevelModel from "@/models/SepLevelModel";
import SepLevelListParams from "@/params/SepLevelListParams";
import { AxiosResponse } from "axios";

export default interface ISepAreaService {
  getAll(
    p?: SepLevelListParams
  ): Promise<AxiosResponse<Response<SepLevelListResponseDto>>>;
  getAllSepLevel(
    p?: SepLevelListParams
  ): Promise<AxiosResponse<Response<SepLevelDto[]>>>;
  getAllForDropDown(): Promise<AxiosResponse<Response<SepLevelDto[]>>>;
  getLevelByLevelAndArea(levelId: number, sepAreaId: number): Promise<AxiosResponse<Response<SepLevelDto[]>>>;
  getById(id: number): Promise<AxiosResponse<Response<SepLevelDto>>>;
  getByName(name: string): Promise<AxiosResponse<Response<SepLevelDto>>>;
  getByLevelId(
    levelId: number
  ): Promise<AxiosResponse<Response<SepLevelDto[]>>>;
  getBySepAreaId(
    sepAreaId: number
  ): Promise<AxiosResponse<Response<SepLevelDto[]>>>;
  add(model: SepLevelModel): Promise<AxiosResponse<Response<SepLevelDto>>>;
  postMultipleSepLevel(model: SepLevelModel[]): Promise<AxiosResponse<Response<PlainDto>>>;
  update(
    id: number,
    model: SepLevelModel
  ): Promise<AxiosResponse<Response<SepLevelDto>>>;
  delete(id: number): Promise<AxiosResponse<Response<SepLevelDto>>>;
}
