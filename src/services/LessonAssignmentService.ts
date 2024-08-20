import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import ILessonAssignmentService from "./interfaces/ILessonAssignmentService";
import LessonAssignmentModel from "@/models/LessonAssignmentModel";
import { StudentMostBasicDto } from "@/dtos/StudentDto";

@injectable()
export default class LessonAssignmentService implements ILessonAssignmentService {
  private readonly httpService: IHttpService;
  constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
    this.httpService = httpService;
  }
  
  getStudentsForLessonAssignment(classId: number, lessonId: number): Promise<AxiosResponse<Response<StudentMostBasicDto[]>>> {
    let result = this.httpService
      .call()
      .get<StudentMostBasicDto[], AxiosResponse<Response<StudentMostBasicDto[]>>>(
        `/LessonAssignment/GetStudentsForLessonAssignment/${classId}/${lessonId}`
      );

    return result;
  }

  assign(model: LessonAssignmentModel): Promise<AxiosResponse<Response<StudentMostBasicDto>>> {
    let result = this.httpService
      .call()
      .post<StudentMostBasicDto, AxiosResponse<Response<StudentMostBasicDto>>>(`/LessonAssignment/Assign`, model);

    return result;
  }
}
