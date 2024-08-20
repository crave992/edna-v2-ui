import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { StudentAllergyDto } from "./../../dtos/StudentAllergyDto";
import { StudentAllergyListResponseDto, StudentAllergyReportDto } from "@/dtos/StudentAllergyReportDto";
import { StudentAllergyListParams } from "@/params/StudentAllergyListParams";
export default interface IStudentAllergyService {
  getByParentIdAndStudentId(
    parentId: number,
    studentId: number
  ): Promise<AxiosResponse<Response<StudentAllergyDto>>>;
  getByStudentId(
    studentId: number
  ): Promise<AxiosResponse<Response<StudentAllergyDto>>>;
  save(model: FormData): Promise<AxiosResponse<Response<StudentAllergyDto>>>;

  getStudentAllergyReport(p?: StudentAllergyListParams): Promise<AxiosResponse<Response<StudentAllergyReportDto>>>;
}
