import ClassDto from "./ClassDto";
import SepTopicDto from "./SepTopicDto";
import { StudentDto } from "./StudentDto";

export interface SEPAssessmentDto {
    id: number;
    studentId: number;
    student: StudentDto;
    classId: number;
    class: ClassDto;
    sepTopicId: number;
    sepTopic: SepTopicDto;
    status: string;
    comment: string | null;
    assessmentDate: Date;
}

export interface SEPAssessmentHistoryDto {
    id: number;
    sepAssessmentId: number;
    sepAssessment: SEPAssessmentDto;
    studentId: number;
    student: StudentDto;
    classId: number;
    class: ClassDto;
    sepTopicId: number;
    sepTopic: SepTopicDto;
    status: string;
    comment: string | null;
    assessmentDate: Date;
}