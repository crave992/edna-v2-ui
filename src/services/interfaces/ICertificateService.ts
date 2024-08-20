import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import { CertificateDto } from "@/dtos/CertificateDto";


export default interface ICertificateService {
  getAll(): Promise<AxiosResponse<Response<CertificateDto[]>>>;
  getById(id: number): Promise<AxiosResponse<Response<CertificateDto>>>;
}
