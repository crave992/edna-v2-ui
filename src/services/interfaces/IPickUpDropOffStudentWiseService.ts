import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import PickUpDropOffStudentWiseModel from "@/models/PickUpDropOffStudentWiseModel";
import PickUpDropOffStudentWiseDto, { PickUpDropOffStudentWiseBasicDto, PickUpDropOffStudentWiseListResponseDto } from "@/dtos/PickUpDropOffStudentWiseDto";
import PickUpDropOffStudentWiseListParams from "@/params/PickUpDropOffStudentWiseListParams";

export default interface IPickUpDropOffStudentWiseService {
    getAll(p?: PickUpDropOffStudentWiseListParams): Promise<AxiosResponse<Response<PickUpDropOffStudentWiseListResponseDto>>>;
    getTodaysPickupDropOff(): Promise<AxiosResponse<Response<PickUpDropOffStudentWiseBasicDto[]>>>;
    savePickUpDropOffStudentWise(model: PickUpDropOffStudentWiseModel): Promise<AxiosResponse<Response<PickUpDropOffStudentWiseDto>>>;
}
