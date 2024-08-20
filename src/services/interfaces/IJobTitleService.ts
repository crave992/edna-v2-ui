import { JobTitleDto, JobTitleListResponseDto } from "@/dtos/JobTitleDto";
import JobTitleModel from "@/models/JobTitleModel";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import JobTitleListParams from "@/params/JobTitleListParams";
export default interface IJobTitleService {
  getAll(
    p: JobTitleListParams
  ): Promise<AxiosResponse<Response<JobTitleListResponseDto>>>;
  getById(id: number): Promise<AxiosResponse<Response<JobTitleDto>>>;
  getAllForDropDown(): Promise<AxiosResponse<Response<JobTitleDto[]>>>;
  add(model: JobTitleModel): Promise<AxiosResponse<Response<JobTitleDto>>>;
  update(
    id: number,
    model: JobTitleModel
  ): Promise<AxiosResponse<Response<JobTitleDto>>>;
  delete(id: number): Promise<AxiosResponse<Response<JobTitleDto>>>;
}
