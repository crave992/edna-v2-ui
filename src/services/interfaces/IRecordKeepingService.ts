import { RecordKeepingDto, RecordKeepingHistoryDto } from "@/dtos/RecordKeepingDto";
import Response from "@/dtos/Response";
import RecordKeepingModel, { RecordKeepingLessonNotesModel } from "@/models/RecordKeepingModel";
import { AxiosResponse } from "axios";

export default interface IRecordKeepingService {
    getByStudentIdClassIdAndLessonId(studentId: number, classId: number, lessonId: number): Promise<AxiosResponse<Response<RecordKeepingDto[]>>>;    
    getHistoryByRecordKeepingId(recordKeepingId: number): Promise<AxiosResponse<Response<RecordKeepingHistoryDto[]>>>;    
    save(studentId: number, classId: number, lessonId: number, modal: RecordKeepingModel): Promise<AxiosResponse<Response<RecordKeepingDto>>>;
    updateRecordKeepingNotes(studentId: number, classId: number, lessonId: number, modal: RecordKeepingLessonNotesModel): Promise<AxiosResponse<Response<RecordKeepingDto>>>;
}
