import { TYPES } from "@/config/types";
import IHttpService from "./interfaces/IHttpService";
import { container } from "@/config/ioc";
import { AxiosResponse } from "axios";
import { injectable } from "inversify";
import Response from "@/dtos/Response";
import IStudentService from "./interfaces/IStudentService";
import { StudentBasicDto, StudentDto, StudentListResponseDto, StudentMostBasicDto } from "@/dtos/StudentDto";
import StudentListParams from "@/params/StudentListParams";

@injectable()
export default class StudentService implements IStudentService {
    private readonly httpService: IHttpService;
    constructor(httpService = container.get<IHttpService>(TYPES.IHttpService)) {
        this.httpService = httpService;
    }

    getBasicListing(): Promise<AxiosResponse<Response<StudentBasicDto[]>>> {
        let result = this.httpService
            .call()
            .get<StudentBasicDto[], AxiosResponse<Response<StudentBasicDto[]>>>(`/Student/GetBasicListing`);

        return result;
    }

    getStudentsByParentId(parentId: number): Promise<AxiosResponse<Response<StudentBasicDto[]>>> {
        let result = this.httpService
            .call()
            .get<StudentBasicDto[], AxiosResponse<Response<StudentBasicDto[]>>>(`/Student/GetStudentsByParentId/${parentId}`);

        return result;
    }

    getMostBasicListing(studentName: string, studentId: number): Promise<AxiosResponse<Response<StudentMostBasicDto[]>>> {        
        let result = this.httpService
            .call()
            .get<StudentMostBasicDto[], AxiosResponse<Response<StudentMostBasicDto[]>>>(`/Student/MostBasicListing?studentName=${studentName}&studentId=${studentId}`);

        return result;
    }

    getByClassId(classId: number): Promise<AxiosResponse<Response<StudentBasicDto[]>>> {        
        let result = this.httpService
            .call()
            .get<StudentBasicDto[], AxiosResponse<Response<StudentBasicDto[]>>>(`/Student/GetByClassId/${classId}`);

        return result;
    }

    getStudents(p: StudentListParams): Promise<AxiosResponse<Response<StudentListResponseDto>>> {
        let result = this.httpService
            .call()
            .get<StudentListResponseDto, AxiosResponse<Response<StudentListResponseDto>>>(`/Student`, {
                params: p
            });

        return result;
    }

    getBasicStudentDetailsById(studentId: number): Promise<AxiosResponse<Response<StudentBasicDto>>> {
        let result = this.httpService
            .call()
            .get<StudentBasicDto, AxiosResponse<Response<StudentBasicDto>>>(`/Student/GetBasicStudentDetailsById/${studentId}`);

        return result;
    }

    getByStudentId(studentId: number): Promise<AxiosResponse<Response<StudentDto>>> {
        let result = this.httpService
            .call()
            .get<StudentDto, AxiosResponse<Response<StudentDto>>>(`/Student/${studentId}`);

        return result;
    }

    add(model: FormData): Promise<AxiosResponse<Response<StudentDto>>> {
        let result = this.httpService
            .call()
            .post<StudentDto, AxiosResponse<Response<StudentDto>>>(`/Student`, model);

        return result;
    }

    update(studentId: number, model: FormData): Promise<AxiosResponse<Response<StudentDto>>> {
        let result = this.httpService
            .call()
            .put<StudentDto, AxiosResponse<Response<StudentDto>>>(`/Student/${studentId}`, model);

        return result;
    }
    updateStudentByStudentIdAndParentId(studentId: number, model: FormData, parentId?: number): Promise<AxiosResponse<Response<StudentDto>>> {
        let result = this.httpService
            .call()
            .put<StudentDto, AxiosResponse<Response<StudentDto>>>(`/Student/UpdateStudentByStudentIdAndParentId/${studentId}?parentId=${parentId}`, model);

        return result;
    }

    updateStudentState(studentId: number, active:boolean): Promise<AxiosResponse<Response<StudentDto>>> {
        let result = this.httpService
            .call()
            .put<StudentDto, AxiosResponse<Response<StudentDto>>>(`/Student/UpdateStudentState/${studentId}?active=${active}`);

        return result;
    }

    updateStudentLevel(studentId: number, levelId:number, optionId:number): Promise<AxiosResponse<Response<StudentDto>>> {
        let result = this.httpService
            .call()
            .put<StudentDto, AxiosResponse<Response<StudentDto>>>(`/Student/UpdateStudentLevel/${studentId}?levelId=${levelId}&optionId=${optionId}`);

        return result;
    }

    updatePicture(model: FormData): Promise<AxiosResponse<Response<StudentDto>>> {
        let result = this.httpService
          .call()
          .put<StudentDto, AxiosResponse<Response<StudentDto>>>(`/Student/UpdatePicture`, model);
    
        return result;
      }
}
