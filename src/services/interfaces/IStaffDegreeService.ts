import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { StaffDegreeDto } from "@/dtos/StaffDto";
import { StaffDegreeModel } from "@/models/StaffModel";
export default interface IStaffDegreeService {
    getAllByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffDegreeDto[]>>>;
    getAll(): Promise<AxiosResponse<Response<StaffDegreeDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<StaffDegreeDto>>>;
    add(model: StaffDegreeModel): Promise<AxiosResponse<Response<StaffDegreeDto>>>;
    update(
        id: number,
        model: StaffDegreeModel
    ): Promise<AxiosResponse<Response<StaffDegreeDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<StaffDegreeDto>>>;
}
