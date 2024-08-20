import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import { StudentPhysicianDto } from "@/dtos/StudentPhysicianDto";
import IStudentPhysicianService from "./interfaces/IStudentPhysicianService";
import { StudentPhysicianModel } from "@/models/StudentPhysicianModel";

@injectable()
export default class StudentPhysicianService
  implements IStudentPhysicianService
{
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getByParentIdAndStudentId(
    parentId: number,
    studentId: number
  ): Promise<AxiosResponse<Response<StudentPhysicianDto>>> {
    let result = this.httpService
      .call()
      .get<StudentPhysicianDto, AxiosResponse<Response<StudentPhysicianDto>>>(
        `/StudentPhysician/GetByParentIdAndStudentId/${parentId}/${studentId}`
      );

    return result;
  }

  getByStudentId(
    studentId: number
  ): Promise<AxiosResponse<Response<StudentPhysicianDto>>> {
    let result = this.httpService
      .call()
      .get<StudentPhysicianDto, AxiosResponse<Response<StudentPhysicianDto>>>(
        `/StudentPhysician/GetByStudentId/${studentId}`
      );

    return result;
  }

  save(
    model: StudentPhysicianModel
  ): Promise<AxiosResponse<Response<StudentPhysicianDto>>> {
    let result = this.httpService
      .call()
      .post<StudentPhysicianDto, AxiosResponse<Response<StudentPhysicianDto>>>(
        `/StudentPhysician`,
        model
      );

    return result;
  }
}
