import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import { EthnicityCategoryDto, EthnicityDto } from "@/dtos/EthnicityDto";


export default interface IEthnicityService {
  getEthnicityCategory(): Promise<AxiosResponse<Response<EthnicityCategoryDto[]>>>;
  getEthnicityByCategoryId(categoryId: number): Promise<AxiosResponse<Response<EthnicityDto[]>>>;
}
