import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { StudentImmunizationDto } from "./../../dtos/StudentImmunizationDto";
export default interface IStudentImmunizationService {
  getByParentIdAndStudentId(
    parentId: number,
    studentId: number
  ): Promise<AxiosResponse<Response<StudentImmunizationDto>>>;
  getByStudentId(
    studentId: number
  ): Promise<AxiosResponse<Response<StudentImmunizationDto>>>;
  save(
    model: FormData
  ): Promise<AxiosResponse<Response<StudentImmunizationDto>>>;
}
