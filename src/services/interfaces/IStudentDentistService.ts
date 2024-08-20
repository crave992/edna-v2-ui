import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";
import { StudentDentistDto } from "./../../dtos/StudentDentistDto";
import { StudentDentistModel } from "@/models/StudentDentistModel";
export default interface IStudentDentistService {
  getByParentIdAndStudentId(
    parentId: number,
    studentId: number
  ): Promise<AxiosResponse<Response<StudentDentistDto>>>;
  getByStudentId(
    studentId: number
  ): Promise<AxiosResponse<Response<StudentDentistDto>>>;
  save(
    model: StudentDentistModel
  ): Promise<AxiosResponse<Response<StudentDentistDto>>>;
}
