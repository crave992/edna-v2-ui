import ClassDto, {
  ClassBasicDto,
  ClassForStaffDashboardDto,
  ClassListResponseDto,
} from "@/dtos/ClassDto";
import Response from "@/dtos/Response";
import { StudentBasicDto } from "@/dtos/StudentDto";
import ClassModel, { StaffClassAssignmentModel } from "@/models/ClassModel";
import ClassListParams from "@/params/ClassListParams";
import { AxiosResponse } from "axios";

export default interface IClassService {
  getAll(
    p?: ClassListParams
  ): Promise<AxiosResponse<Response<ClassListResponseDto>>>;
  getClassByStaffId(staffId: number): Promise<AxiosResponse<Response<ClassBasicDto[]>>>;
  getClassByStudentId(studentId: number): Promise<AxiosResponse<Response<ClassBasicDto[]>>>;
  getClassByLevel(
    levelId: number
  ): Promise<AxiosResponse<Response<ClassBasicDto[]>>>;
  getClassByLevelIdAndStudentId(
    levelId: number,
    studentId: number
  ): Promise<AxiosResponse<Response<ClassBasicDto[]>>>;
  getClassForStaffDashboard(): Promise<
    AxiosResponse<Response<ClassForStaffDashboardDto[]>>
    >;
  
  getClassBasicDetails(classId: number, q?: string): Promise<AxiosResponse<Response<ClassDto>>>;
  getStudentForStaffByClassId(classId: number, q?: string): Promise<AxiosResponse<Response<StudentBasicDto[]>>>;
  
  getById(id: number): Promise<AxiosResponse<Response<ClassDto>>>;
  assignStaff(
    model: StaffClassAssignmentModel
  ): Promise<AxiosResponse<Response<ClassDto>>>;
  removeStaff(
    model: StaffClassAssignmentModel
  ): Promise<AxiosResponse<Response<ClassDto>>>;
  add(model: ClassModel): Promise<AxiosResponse<Response<ClassDto>>>;
  update(
    id: number,
    model: ClassModel
  ): Promise<AxiosResponse<Response<ClassDto>>>;
  delete(id: number): Promise<AxiosResponse<Response<ClassDto>>>;
}
