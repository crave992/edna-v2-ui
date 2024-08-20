import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { StaffReferenceDto } from "@/dtos/StaffDto";
import { StaffReferenceModel } from "@/models/StaffModel";
export default interface IStaffReferenceService {
    getAllByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffReferenceDto[]>>>;
    getAll(): Promise<AxiosResponse<Response<StaffReferenceDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<StaffReferenceDto>>>;
    add(model: StaffReferenceModel): Promise<AxiosResponse<Response<StaffReferenceDto>>>;
    update(
        id: number,
        model: StaffReferenceModel
    ): Promise<AxiosResponse<Response<StaffReferenceDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<StaffReferenceDto>>>;
}
