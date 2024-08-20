import HolidayDto from "@/dtos/HolidayDto";
import Response from "@/dtos/Response";
import HolidayModel from "@/models/HolidayModel";
import { AxiosResponse } from "axios";

export default interface IHolidayService {
    getAll(): Promise<AxiosResponse<Response<HolidayDto[]>>>;
    getById(id: number): Promise<AxiosResponse<Response<HolidayDto>>>;
    add(model: FormData): Promise<AxiosResponse<Response<HolidayDto>>>;
    update(id: number, model: FormData): Promise<AxiosResponse<Response<HolidayDto>>>;
}
