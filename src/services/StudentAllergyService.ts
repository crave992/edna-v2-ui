import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import IStudentAllergyService from "./interfaces/IStudentAllergyService";
import { StudentAllergyDto } from "@/dtos/StudentAllergyDto";
import { StudentAllergyListResponseDto, StudentAllergyReportDto } from "@/dtos/StudentAllergyReportDto";
import { StudentAllergyListParams } from "@/params/StudentAllergyListParams";

@injectable()
export default class StudentAllergyService implements IStudentAllergyService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }

  getByParentIdAndStudentId(
    parentId: number,
    studentId: number
  ): Promise<AxiosResponse<Response<StudentAllergyDto>>> {
    let result = this.httpService
      .call()
      .get<StudentAllergyDto, AxiosResponse<Response<StudentAllergyDto>>>(
        `/StudentAllergy/GetByParentIdAndStudentId/${parentId}/${studentId}`
      );

    return result;
  }

  getByStudentId(
    studentId: number
  ): Promise<AxiosResponse<Response<StudentAllergyDto>>> {
    let result = this.httpService
      .call()
      .get<StudentAllergyDto, AxiosResponse<Response<StudentAllergyDto>>>(
        `/StudentAllergy/GetByStudentId/${studentId}`
      );

    return result;
  }

  save(model: FormData): Promise<AxiosResponse<Response<StudentAllergyDto>>> {
    let result = this.httpService
      .call()
      .post<StudentAllergyDto, AxiosResponse<Response<StudentAllergyDto>>>(
        `/StudentAllergy`,
        model
      );

    return result;
  }


  getStudentAllergyReport(p?: StudentAllergyListParams): Promise<AxiosResponse<Response<StudentAllergyReportDto>>> {
    let result = this.httpService
      .call()
      .get<StudentAllergyReportDto, AxiosResponse<Response<StudentAllergyReportDto>>>(
        `/StudentAllergy/Report`, {
        params: p
      }
      );
    return result;
  }
}
