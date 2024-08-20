import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import ClassAttendanceDto, { ClassAttendanceReportsDto, ClassAttendanceReportsListResponseDto } from "@/dtos/ClassAttendanceDto";
import IClassAttendanceService from "./interfaces/IClassAttendanceService";
import ClassAttendanceOverViewDto from "@/dtos/ClassAttendanceOverViewDto";
import ClassAttendanceListParams from "@/params/ClassAttendanceListParams";
import AttendanceModal, {
  ClassAttendanceMakeModel,
} from "@/models/AttendanceModal";
import { StudentAttendanceListParams } from "@/params/StudentAttendanceListParams";
import { StudentAttendanceDto } from "@/dtos/StudentAttendanceDto";
import { ClassAttendanceReportsListParams } from "@/params/ClassAttendanceReportsListParams";

@injectable()
export default class ClassAttendanceService implements IClassAttendanceService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAttendanceByClassId(
    classId: number,
    p?: ClassAttendanceListParams
  ): Promise<AxiosResponse<Response<ClassAttendanceDto[]>>> {
    let result = this.httpService
      .call()
      .get<ClassAttendanceDto[], AxiosResponse<Response<ClassAttendanceDto[]>>>(
        `/ClassAttendance/GetAttendanceByClassId/${classId}`,
        {
          params: p,
        }
      );

    return result;
  }

  getAttendanceByStudentId(
    studentId: number,
    p?: StudentAttendanceListParams
  ): Promise<AxiosResponse<Response<StudentAttendanceDto[]>>> {
    let result = this.httpService
      .call()
      .get<
        StudentAttendanceDto[],
        AxiosResponse<Response<StudentAttendanceDto[]>>
      >(`/ClassAttendance/GetAttendanceByStudentId/${studentId}`, {
        params: p,
      });

    return result;
  }

  getAttendanceOverView(
    modal: AttendanceModal
  ): Promise<AxiosResponse<Response<ClassAttendanceOverViewDto[]>>> {
    let result = this.httpService
      .call()
      .get<
        ClassAttendanceOverViewDto[],
        AxiosResponse<Response<ClassAttendanceOverViewDto[]>>
      >(`/ClassAttendance/GetAttendanceOverView`, {
        params: modal,
      });

    return result;
  }

  addStudentAttendance(
    model: ClassAttendanceMakeModel
  ): Promise<AxiosResponse<Response<ClassAttendanceDto[]>>> {
    let result = this.httpService
      .call()
      .post<
        ClassAttendanceDto[],
        AxiosResponse<Response<ClassAttendanceDto[]>>
      >(`/ClassAttendance/StudentAttendance`, model);

    return result;
  }

  getReportsByStudent(p?: ClassAttendanceReportsListParams): Promise<AxiosResponse<Response<ClassAttendanceReportsListResponseDto>>> {
    let result = this.httpService
      .call()
      .get<ClassAttendanceReportsListResponseDto, AxiosResponse<Response<ClassAttendanceReportsListResponseDto>>>(
        `/ClassAttendance/GetReportsByStudent`, {
        params: p,
      }
      );
    return result;
  }
  getReportsByClass(p?: ClassAttendanceReportsListParams): Promise<AxiosResponse<Response<ClassAttendanceReportsListResponseDto>>> {
    let result = this.httpService
      .call()
      .get<ClassAttendanceReportsListResponseDto, AxiosResponse<Response<ClassAttendanceReportsListResponseDto>>>(
        `/ClassAttendance/GetReportsByClass`, {
        params: p,
      }
      );
    return result;
  }
}
