import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import ClassDto, {
  ClassBasicDto,
  ClassForStaffDashboardDto,
  ClassListResponseDto,
} from "@/dtos/ClassDto";
import ClassModel, { StaffClassAssignmentModel } from "@/models/ClassModel";
import IClassService from "./interfaces/IClassService";
import ClassListParams from "@/params/ClassListParams";
import { StudentBasicDto } from "@/dtos/StudentDto";

@injectable()
export default class ClassService implements IClassService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getAll(
    p: ClassListParams
  ): Promise<AxiosResponse<Response<ClassListResponseDto>>> {
    let result = this.httpService
      .call()
      .get<ClassListResponseDto, AxiosResponse<Response<ClassListResponseDto>>>(
        `/Class`,
        {
          params: p,
        }
      );

    return result;
  }

  getClassByStaffId(
    staffId: number
  ): Promise<AxiosResponse<Response<ClassBasicDto[]>>> {
    let result = this.httpService
      .call()
      .get<ClassBasicDto[], AxiosResponse<Response<ClassBasicDto[]>>>(
        `/Class/GetClassByStaffId?staffId=${staffId}`
      );

    return result;
  }

  getClassByStudentId(studentId: number): Promise<AxiosResponse<Response<ClassBasicDto[]>>> {
    let result = this.httpService
      .call()
      .get<ClassBasicDto[], AxiosResponse<Response<ClassBasicDto[]>>>(
        `/Class/GetClassByStudentId/${studentId}`
      );

    return result;
  }

  getClassByLevel(
    levelId: number
  ): Promise<AxiosResponse<Response<ClassBasicDto[]>>> {
    let result = this.httpService
      .call()
      .get<ClassBasicDto[], AxiosResponse<Response<ClassBasicDto[]>>>(
        `/Class/GetClassByLevel/${levelId}`
      );

    return result;
  }

  getClassByLevelIdAndStudentId(
    levelId: number,
    studentId: number
  ): Promise<AxiosResponse<Response<ClassBasicDto[]>>> {
    let result = this.httpService
      .call()
      .get<ClassBasicDto[], AxiosResponse<Response<ClassBasicDto[]>>>(
        `/Class/GetClassByLevelIdAndStudentId/${levelId}/${studentId}`
      );

    return result;
  }

  getClassForStaffDashboard(): Promise<
    AxiosResponse<Response<ClassForStaffDashboardDto[]>>
  > {
    let result = this.httpService
      .call()
      .get<
        ClassForStaffDashboardDto[],
        AxiosResponse<Response<ClassForStaffDashboardDto[]>>
      >(`/Class/GetClassForStaffDashboard`);

    return result;
  }

  getById(id: number): Promise<AxiosResponse<Response<ClassDto>>> {
    let result = this.httpService
      .call()
      .get<ClassDto, AxiosResponse<Response<ClassDto>>>(`/Class/${id}`);

    return result;
  }

  getClassBasicDetails(
    classId: number, q?:string
  ): Promise<AxiosResponse<Response<ClassDto>>> {
    let result = this.httpService
      .call()
      .get<ClassDto, AxiosResponse<Response<ClassDto>>>(
        `/Class/GetBasicDetails/${classId}?q=${q}`
      );

    return result;
  }
  getStudentForStaffByClassId(
    classId: number, q?:string
  ): Promise<AxiosResponse<Response<StudentBasicDto[]>>> {
    let result = this.httpService
      .call()
      .get<StudentBasicDto[], AxiosResponse<Response<StudentBasicDto[]>>>(
        `/Class/GetStudentForStaffByClassId/${classId}?q=${q}`
      );

    return result;
  }

  assignStaff(
    model: StaffClassAssignmentModel
  ): Promise<AxiosResponse<Response<ClassDto>>> {
    let result = this.httpService
      .call()
      .post<ClassDto, AxiosResponse<Response<ClassDto>>>(
        `/Class/AssignStaff`,
        model
      );
    return result;
  }
  removeStaff(
    model: StaffClassAssignmentModel
  ): Promise<AxiosResponse<Response<ClassDto>>> {
    let result = this.httpService
      .call()
      .post<ClassDto, AxiosResponse<Response<ClassDto>>>(
        `/Class/RemoveStaff`,
        model
      );
    return result;
  }

  add(model: ClassModel): Promise<AxiosResponse<Response<ClassDto>>> {
    let result = this.httpService
      .call()
      .post<ClassDto, AxiosResponse<Response<ClassDto>>>(`/Class`, model);

    return result;
  }

  update(
    id: number,
    model: ClassModel
  ): Promise<AxiosResponse<Response<ClassDto>>> {
    let result = this.httpService
      .call()
      .put<ClassDto, AxiosResponse<Response<ClassDto>>>(`/Class/${id}`, model);

    return result;
  }

  delete(id: number): Promise<AxiosResponse<Response<ClassDto>>> {
    let result = this.httpService
      .call()
      .delete<ClassDto, AxiosResponse<Response<ClassDto>>>(`/Class/${id}`);

    return result;
  }
}
