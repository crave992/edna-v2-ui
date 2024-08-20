import HolidayTypeDto from "@/dtos/HolidayTypeDto";
import Response from "@/dtos/Response";
import HolidayTypeModel from "@/models/HolidayTypeModel";
import { AxiosResponse } from "axios";

export default interface IHolidayTypeService {
    getAll(q?: string): Promise<AxiosResponse<Response<HolidayTypeDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<HolidayTypeDto>>>;
    add(model: HolidayTypeModel): Promise<AxiosResponse<Response<HolidayTypeDto>>>;
    update(
        id: number,
        model: HolidayTypeModel
    ): Promise<AxiosResponse<Response<HolidayTypeDto>>>;
    delete(id: number): Promise<AxiosResponse<Response<HolidayTypeDto>>>;
}
