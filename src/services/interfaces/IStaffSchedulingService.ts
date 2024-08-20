import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import { StaffSchedulingDisplayListResponseDto, StaffSchedulingDto, WorkingDaysDto, WorkingDaysMappedDto } from "@/dtos/StaffSchedulingDto";
import StaffWorkingDaysSchedulingModel from "@/models/StaffWorkingDaysSchedulingModel";
import PlainDto from "@/dtos/PlainDto";
import { StaffSchedulingModel, StaffSchedulingSaveModel } from "@/models/StaffSchedulingModel";
import StaffSchedulesParams from "@/params/StaffSchedulesParams";

export default interface IStaffSchedulingService {
  getAllWorkingDays(): Promise<AxiosResponse<Response<WorkingDaysDto[]>>>;  
  getAllStaffScheduling(p: StaffSchedulesParams): Promise<AxiosResponse<Response<StaffSchedulingDisplayListResponseDto>>>; 
  getWorkingDaysByStaffId(staffId: number): Promise<AxiosResponse<Response<WorkingDaysMappedDto[]>>>;  
  saveStaffWorkingDays(model: StaffWorkingDaysSchedulingModel): Promise<AxiosResponse<Response<PlainDto>>>; 
  getStaffSchedulingByStaffId(staffId: number): Promise<AxiosResponse<Response<StaffSchedulingDto[]>>>; 
  getStaffSchedulingByStaffIdAndId(staffId: number, id: number): Promise<AxiosResponse<Response<StaffSchedulingDto>>>;   
  add(model: StaffSchedulingSaveModel): Promise<AxiosResponse<Response<StaffSchedulingDto[]>>>;   
  update(id: number, model: StaffSchedulingModel): Promise<AxiosResponse<Response<StaffSchedulingDto>>>;   
  delete(id: number, staffId: number): Promise<AxiosResponse<Response<StaffSchedulingDto>>>;   
}
