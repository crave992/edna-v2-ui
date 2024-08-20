import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import { StudentDentistDto } from "@/dtos/StudentDentistDto";
import { StudentDentistModel } from "@/models/StudentDentistModel";
import IStudentDentistService from "./interfaces/IStudentDentistService";

@injectable()
export default class StudentDentistService implements IStudentDentistService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getByParentIdAndStudentId(
    parentId: number,
    studentId: number
  ): Promise<AxiosResponse<Response<StudentDentistDto>>> {
    let result = this.httpService
      .call()
      .get<StudentDentistDto, AxiosResponse<Response<StudentDentistDto>>>(
        `/StudentDentist/GetByParentIdAndStudentId/${parentId}/${studentId}`
      );

    return result;
  }

  getByStudentId(
    studentId: number
  ): Promise<AxiosResponse<Response<StudentDentistDto>>> {
    let result = this.httpService
      .call()
      .get<StudentDentistDto, AxiosResponse<Response<StudentDentistDto>>>(
        `/StudentDentist/GetByStudentId/${studentId}`
      );

    return result;
  }

  save(
    model: StudentDentistModel
  ): Promise<AxiosResponse<Response<StudentDentistDto>>> {
    let result = this.httpService
      .call()
      .post<StudentDentistDto, AxiosResponse<Response<StudentDentistDto>>>(
        `/StudentDentist`,
        model
      );

    return result;
  }
}
