import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import RegistrationFeesParams from "@/params/RegistrationFeesParams";
import RegistrationFeesDto from "@/dtos/RegistrationFeesDto";
import RegistrationFeesModel from "@/models/RegistrationFeesModel";

export default interface IRegistrationFeesService {
    getAll(
        p: RegistrationFeesParams
    ): Promise<AxiosResponse<Response<RegistrationFeesDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<RegistrationFeesDto>>>;
    getByLevelId(levelId: number): Promise<AxiosResponse<Response<RegistrationFeesDto[]>>>;
    add(model: RegistrationFeesModel): Promise<AxiosResponse<Response<RegistrationFeesDto>>>;
    update(
        id: number,
        model: RegistrationFeesModel
    ): Promise<AxiosResponse<Response<RegistrationFeesDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<RegistrationFeesDto>>>;
    getOrganizationId(): Promise<AxiosResponse<Response<RegistrationFeesDto>>>;
    getSchoolFeeSettings(): Promise<AxiosResponse<Response<RegistrationFeesDto>>>;
}
