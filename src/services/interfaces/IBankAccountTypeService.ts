import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import { BankAccountTypeDto } from "@/dtos/BankAccountTypeDto";


export default interface IBankAccountTypeService {
  getAll(): Promise<AxiosResponse<Response<BankAccountTypeDto[]>>>;
  getById(id: number): Promise<AxiosResponse<Response<BankAccountTypeDto>>>;
}
