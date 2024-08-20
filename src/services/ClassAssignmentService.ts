import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import ClassAssignmentDto from "@/dtos/ClassAssignmentDto";
import IClassAssignmentService from "./interfaces/IClassAssignmentService";
import { ClassBasicDto } from "@/dtos/ClassDto";
import AssignStudentInClassModal from "@/models/AssignStudentInClassModal";
import PlainDto from "@/dtos/PlainDto";

@injectable()
export default class ClassAssignmentService implements IClassAssignmentService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getClassByStudentId(studentId: number): Promise<AxiosResponse<Response<ClassAssignmentDto[]>>> {
        let result = this.httpService
            .call()
            .get<ClassAssignmentDto[], AxiosResponse<Response<ClassAssignmentDto[]>>>(
                `/ClassAssignment/GetClassByStudentId/${studentId}`
            );

        return result;
    }

    getNotAssignedClassByStudentId(studentId: number): Promise<AxiosResponse<Response<ClassBasicDto[]>>> {
        let result = this.httpService
            .call()
            .get<ClassBasicDto[], AxiosResponse<Response<ClassBasicDto[]>>>(
                `/ClassAssignment/GetNotAssignedClassByStudentId/${studentId}`
            );

        return result;
    }

    assignStudentInClass(modal: AssignStudentInClassModal): Promise<AxiosResponse<Response<PlainDto>>> {
        let result = this.httpService
            .call()
            .post<PlainDto, AxiosResponse<Response<PlainDto>>>(
                `/ClassAssignment/AssignStudentInClass`, modal
            );

        return result;
    }

    removeStudentFromClass(studentId: number, classId: number): Promise<AxiosResponse<Response<PlainDto>>> {
        let result = this.httpService
            .call()
            .delete<PlainDto, AxiosResponse<Response<PlainDto>>>(
                `/ClassAssignment/RemoveStudentFromClass/${studentId}/${classId}`
            );

        return result;
    }
}
