import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import IStudentImmunizationService from "./interfaces/IStudentImmunizationService";
import { StudentImmunizationDto } from "@/dtos/StudentImmunizationDto";

@injectable()
export default class StudentImmunizationService
  implements IStudentImmunizationService
{
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getByParentIdAndStudentId(
    parentId: number,
    studentId: number
  ): Promise<AxiosResponse<Response<StudentImmunizationDto>>> {
    let result = this.httpService
      .call()
      .get<
        StudentImmunizationDto,
        AxiosResponse<Response<StudentImmunizationDto>>
      >(
        `/StudentImmunization/GetByParentIdAndStudentId/${parentId}/${studentId}`
      );

    return result;
  }

  getByStudentId(
    studentId: number
  ): Promise<AxiosResponse<Response<StudentImmunizationDto>>> {
    let result = this.httpService
      .call()
      .get<
        StudentImmunizationDto,
        AxiosResponse<Response<StudentImmunizationDto>>
      >(`/StudentImmunization/GetByStudentId/${studentId}`);

    return result;
  }

  save(
    model: FormData
  ): Promise<AxiosResponse<Response<StudentImmunizationDto>>> {
    let result = this.httpService
      .call()
      .post<
        StudentImmunizationDto,
        AxiosResponse<Response<StudentImmunizationDto>>
      >(`/StudentImmunization`, model);

    return result;
  }
}
