import PlainDto from "@/dtos/PlainDto";
import Response from "@/dtos/Response";
import SepAreaDto, { SepAreaListResponseDto } from "@/dtos/SepAreaDto";
import SepAreaModel from "@/models/SepAreaModel";
import SepAreaListParams from "@/params/SepAreaListParams";
import { AxiosResponse } from "axios";

export default interface IAreaService {
  getAll(
    p?: SepAreaListParams
  ): Promise<AxiosResponse<Response<SepAreaListResponseDto>>>;
  getAllSepArea(
    p?: SepAreaListParams
  ): Promise<AxiosResponse<Response<SepAreaDto[]>>>;
  getAreaByLevel(levelId:number): Promise<AxiosResponse<Response<SepAreaDto[]>>>;
  getAllForDropDown(): Promise<AxiosResponse<Response<SepAreaDto[]>>>;
  getById(id: number): Promise<AxiosResponse<Response<SepAreaDto>>>;
  getByName(name: string): Promise<AxiosResponse<Response<SepAreaDto>>>;
  getByLevelId(levelId: number): Promise<AxiosResponse<Response<SepAreaDto[]>>>;
  add(model: SepAreaModel): Promise<AxiosResponse<Response<SepAreaDto>>>;
  postMultipleSepArea(model: SepAreaModel[]): Promise<AxiosResponse<Response<PlainDto>>>;
  update(
    id: number,
    model: SepAreaModel
  ): Promise<AxiosResponse<Response<SepAreaDto>>>;
  delete(id: number): Promise<AxiosResponse<Response<SepAreaDto>>>;
}
