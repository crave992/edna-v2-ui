import ClassAssignmentDto from "@/dtos/ClassAssignmentDto";
import { ClassBasicDto } from "@/dtos/ClassDto";
import PlainDto from "@/dtos/PlainDto";
import Response from "@/dtos/Response";
import AssignStudentInClassModal from "@/models/AssignStudentInClassModal";
import { AxiosResponse } from "axios";

export default interface IClassAssignmentService {
    getClassByStudentId(studentId: number): Promise<AxiosResponse<Response<ClassAssignmentDto[]>>>;    
    getNotAssignedClassByStudentId(studentId: number): Promise<AxiosResponse<Response<ClassBasicDto[]>>>;    
    assignStudentInClass(modal: AssignStudentInClassModal): Promise<AxiosResponse<Response<PlainDto>>>;    
    removeStudentFromClass(studentId: number, classId: number): Promise<AxiosResponse<Response<PlainDto>>>;    
}
