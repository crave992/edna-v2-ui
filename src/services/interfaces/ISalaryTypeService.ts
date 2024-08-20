import Response from "@/dtos/Response";
import SalaryTypeDto from "@/dtos/SalaryTypeDto";
import { AxiosResponse } from "axios";

export default interface ISalaryTypeService {
    getAll(): Promise<AxiosResponse<Response<SalaryTypeDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<SalaryTypeDto>>>;    
}
