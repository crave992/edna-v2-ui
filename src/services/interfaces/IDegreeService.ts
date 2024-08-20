import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import { DegreeDto } from "@/dtos/DegreeDto";


export default interface IDegreeService {
  getAll(): Promise<AxiosResponse<Response<DegreeDto[]>>>;
  getById(id: number): Promise<AxiosResponse<Response<DegreeDto>>>;
}
