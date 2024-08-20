import {
  StaffTimeTrackingDto,
  StaffTimeTrackingListResponseDto,
} from "./../../dtos/StaffTimeTrackingDto";
import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import { StaffTimeTrackingListParams } from "@/params/StaffTimeTrackingListParams";
import { StaffTimeTrackingModel } from "@/models/StaffTimeTrackingModel";

export default interface IStaffTimeTrackingService {
  get(
    q?: StaffTimeTrackingListParams
  ): Promise<AxiosResponse<Response<StaffTimeTrackingListResponseDto>>>;
  getById(id: number): Promise<AxiosResponse<Response<StaffTimeTrackingDto>>>;
  add(
    model: StaffTimeTrackingModel
  ): Promise<AxiosResponse<Response<StaffTimeTrackingDto>>>;
  update(
    id: number,
    model: StaffTimeTrackingModel
  ): Promise<AxiosResponse<Response<StaffTimeTrackingDto>>>;
  delete(id: number): Promise<AxiosResponse<Response<StaffTimeTrackingDto>>>;
}
