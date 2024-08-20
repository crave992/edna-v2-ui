import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { StaffEmploymentHistoryDto } from "@/dtos/StaffDto";
import { StaffEmploymentHistoryModel } from "@/models/StaffModel";
export default interface IStaffEmploymentHistoryService {
    getAllByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffEmploymentHistoryDto[]>>>;
    getAll(): Promise<AxiosResponse<Response<StaffEmploymentHistoryDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<StaffEmploymentHistoryDto>>>;
    add(model: StaffEmploymentHistoryModel): Promise<AxiosResponse<Response<StaffEmploymentHistoryDto>>>;
    update(
        id: number,
        model: StaffEmploymentHistoryModel
    ): Promise<AxiosResponse<Response<StaffEmploymentHistoryDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<StaffEmploymentHistoryDto>>>;
}
