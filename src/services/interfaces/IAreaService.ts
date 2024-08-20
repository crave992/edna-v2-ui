import Response from "@/dtos/Response";
import AreaDto, { AreaListResponseDto } from "@/dtos/AreaDto";
import AreaModel from "@/models/AreaModel";
import AreaListParams from "@/params/AreaListParams";
import { AxiosResponse } from "axios";
import PlainDto from "@/dtos/PlainDto";

export default interface IAreaService {
  getAll(
    p: AreaListParams
  ): Promise<AxiosResponse<Response<AreaListResponseDto>>>;
  getAllArea(p?: AreaListParams): Promise<AxiosResponse<Response<AreaDto[]>>>;
  getAreaByLevel(levelId: number): Promise<AxiosResponse<Response<AreaDto[]>>>;
  getAllForDropDown(): Promise<AxiosResponse<Response<AreaListResponseDto>>>;
  getById(id: number): Promise<AxiosResponse<Response<AreaDto>>>;
  getByName(name: string): Promise<AxiosResponse<Response<AreaDto>>>;
  getByLevelId(levelId: number): Promise<AxiosResponse<Response<AreaDto[]>>>;
  add(model: AreaModel): Promise<AxiosResponse<Response<AreaDto>>>;
  postMultipleArea(model: AreaModel[]): Promise<AxiosResponse<Response<PlainDto>>>;
  update(
    id: number,
    model: AreaModel
  ): Promise<AxiosResponse<Response<AreaDto>>>;
  delete(id: number): Promise<AxiosResponse<Response<AreaDto>>>;
}
