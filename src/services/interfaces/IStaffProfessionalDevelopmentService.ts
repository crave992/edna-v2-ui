import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { StaffProfessionalDevelopmentDto } from "@/dtos/StaffDto";
import { StaffProfessionalDevelopmentModel } from "@/models/StaffModel";
export default interface IStaffProfessionalDevelopmentService {
    getAllByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffProfessionalDevelopmentDto[]>>>;
    getAll(): Promise<AxiosResponse<Response<StaffProfessionalDevelopmentDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<StaffProfessionalDevelopmentDto>>>;
    add(model: StaffProfessionalDevelopmentModel): Promise<AxiosResponse<Response<StaffProfessionalDevelopmentDto>>>;
    update(
        id: number,
        model: StaffProfessionalDevelopmentModel
    ): Promise<AxiosResponse<Response<StaffProfessionalDevelopmentDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<StaffProfessionalDevelopmentDto>>>;
}
