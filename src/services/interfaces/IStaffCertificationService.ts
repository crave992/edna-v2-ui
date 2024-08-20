import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { StaffCertificationDto } from "@/dtos/StaffDto";
import { StaffCertificationModel } from "@/models/StaffModel";
export default interface IStaffCertificationService {
    getAllByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffCertificationDto[]>>>;
    getAll(): Promise<AxiosResponse<Response<StaffCertificationDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<StaffCertificationDto>>>;
    add(model: StaffCertificationModel): Promise<AxiosResponse<Response<StaffCertificationDto>>>;
    update(
        id: number,
        model: StaffCertificationModel
    ): Promise<AxiosResponse<Response<StaffCertificationDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<StaffCertificationDto>>>;
}
