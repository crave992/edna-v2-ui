import ClassAttendanceDto, { ClassAttendanceReportsDto, ClassAttendanceReportsListResponseDto } from "@/dtos/ClassAttendanceDto";
import ClassAttendanceOverViewDto from "@/dtos/ClassAttendanceOverViewDto";
import Response from "@/dtos/Response";
import { StudentAttendanceDto } from "@/dtos/StudentAttendanceDto";
import AttendanceModal, {
  ClassAttendanceMakeModel,
} from "@/models/AttendanceModal";
import ClassAttendanceListParams from "@/params/ClassAttendanceListParams";
import { ClassAttendanceReportsListParams } from "@/params/ClassAttendanceReportsListParams";
import { StudentAttendanceListParams } from "@/params/StudentAttendanceListParams";
import { AxiosResponse } from "axios";

export default interface IClassAttendanceService {
  getAttendanceByClassId(
    classId: number,
    p?: ClassAttendanceListParams
  ): Promise<AxiosResponse<Response<ClassAttendanceDto[]>>>;
  getAttendanceByStudentId(
    studentId: number,
    p?: StudentAttendanceListParams
  ): Promise<AxiosResponse<Response<StudentAttendanceDto[]>>>;
  getAttendanceOverView(
    modal: AttendanceModal
  ): Promise<AxiosResponse<Response<ClassAttendanceOverViewDto[]>>>;
  addStudentAttendance(
    modal: ClassAttendanceMakeModel
  ): Promise<AxiosResponse<Response<ClassAttendanceDto[]>>>;

  getReportsByStudent(p?: ClassAttendanceReportsListParams): Promise<AxiosResponse<Response<ClassAttendanceReportsListResponseDto>>>;
  getReportsByClass(p?: ClassAttendanceReportsListParams): Promise<AxiosResponse<Response<ClassAttendanceReportsListResponseDto>>>;
}
