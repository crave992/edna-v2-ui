import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { StaffEmergencyContactDto } from "@/dtos/StaffDto";
import { StaffEmergencyContactModel } from "@/models/StaffModel";
export default interface IStaffEmergencyContactService {
    getAllByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffEmergencyContactDto[]>>>;
    getAll(): Promise<AxiosResponse<Response<StaffEmergencyContactDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<StaffEmergencyContactDto>>>;
    add(model: StaffEmergencyContactModel): Promise<AxiosResponse<Response<StaffEmergencyContactDto>>>;
    update(
        id: number,
        model: StaffEmergencyContactModel
    ): Promise<AxiosResponse<Response<StaffEmergencyContactDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<StaffEmergencyContactDto>>>;
}
