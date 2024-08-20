import Response from "@/dtos/Response";
import { StudentBasicDto, StudentDto, StudentListResponseDto, StudentMostBasicDto } from "@/dtos/StudentDto";
import StudentListParams from "@/params/StudentListParams";
import { AxiosResponse } from "axios";

export default interface IStudentService {
    getBasicListing(): Promise<AxiosResponse<Response<StudentBasicDto[]>>>;
    getStudentsByParentId(parentId: number): Promise<AxiosResponse<Response<StudentBasicDto[]>>>;
    getMostBasicListing(studentName: string, studentId: number): Promise<AxiosResponse<Response<StudentMostBasicDto[]>>>;
    getByClassId(classId: number): Promise<AxiosResponse<Response<StudentBasicDto[]>>>;
    getStudents(p: StudentListParams): Promise<AxiosResponse<Response<StudentListResponseDto>>>;
    getBasicStudentDetailsById(studentId: number): Promise<AxiosResponse<Response<StudentBasicDto>>>;
    getByStudentId(studentId: number): Promise<AxiosResponse<Response<StudentDto>>>;
    add(model: FormData): Promise<AxiosResponse<Response<StudentDto>>>;    
    update(studentId: number, model: FormData): Promise<AxiosResponse<Response<StudentDto>>>;
    updateStudentByStudentIdAndParentId(studentId: number, model: FormData, parentId?:number): Promise<AxiosResponse<Response<StudentDto>>>;
    updateStudentState(studentId: number, active:boolean): Promise<AxiosResponse<Response<StudentDto>>>;
    updateStudentLevel(studentId: number, levelId:number, optionId:number): Promise<AxiosResponse<Response<StudentDto>>>;
    updatePicture(model: FormData): Promise<AxiosResponse<Response<StudentDto>>>;
}