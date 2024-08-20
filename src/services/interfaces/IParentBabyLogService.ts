import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import ParentBabyLogDto, { DiaperingDto, FeedingDto, NappingDto, OtherBabyLogDto } from "@/dtos/ParentBabyLogDto";
import ParentBabyLogModel from "@/models/ParentBabyLogModel";

export default interface IParentBabyLogService {
    getBabyLogReportByStudentId(studentId:number): Promise<AxiosResponse<Response<ParentBabyLogDto>>>;
    addParentBabyLog(model: ParentBabyLogModel): Promise<AxiosResponse<Response<ParentBabyLogDto>>>;

    getFeedingByStudentId(studentId: number): Promise<AxiosResponse<Response<FeedingDto[]>>>;
    addFeeding(model: FormData): Promise<AxiosResponse<Response<FeedingDto>>>;
    
    getNappingByStudentId(studentId: number): Promise<AxiosResponse<Response<NappingDto[]>>>;
    addNapping(model: FormData): Promise<AxiosResponse<Response<NappingDto>>>;
    
    getDiaperingByStudentId(studentId: number): Promise<AxiosResponse<Response<DiaperingDto[]>>>;
    addDiapering(model: FormData): Promise<AxiosResponse<Response<DiaperingDto>>>;

    getOtherBabyLogByStudentId(studentId: number): Promise<AxiosResponse<Response<OtherBabyLogDto[]>>>;
    addOtherBabyLog(model: FormData): Promise<AxiosResponse<Response<OtherBabyLogDto>>>;
}
