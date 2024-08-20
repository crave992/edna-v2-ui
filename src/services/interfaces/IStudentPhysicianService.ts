import { StudentPhysicianModel } from "./../../models/StudentPhysicianModel";
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { StudentPhysicianDto } from "./../../dtos/StudentPhysicianDto";
export default interface IStudentPhysicianService {
  getByParentIdAndStudentId(
    parentId: number,
    studentId: number
  ): Promise<AxiosResponse<Response<StudentPhysicianDto>>>;
  getByStudentId(
    studentId: number
  ): Promise<AxiosResponse<Response<StudentPhysicianDto>>>;
  save(
    model: StudentPhysicianModel
  ): Promise<AxiosResponse<Response<StudentPhysicianDto>>>;
}
