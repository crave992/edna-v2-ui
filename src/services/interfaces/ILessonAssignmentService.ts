import Response from "@/dtos/Response";
import AreaDto from "@/dtos/AreaDto";
import { AxiosResponse } from "axios";
import LessonAssignmentModel from "@/models/LessonAssignmentModel";
import { StudentMostBasicDto } from "@/dtos/StudentDto";

export default interface ILessonAssignmentService {
  getStudentsForLessonAssignment(classId: number, lessonId: number): Promise<AxiosResponse<Response<StudentMostBasicDto[]>>>;
  assign(model: LessonAssignmentModel): Promise<AxiosResponse<Response<StudentMostBasicDto>>>;  
}
