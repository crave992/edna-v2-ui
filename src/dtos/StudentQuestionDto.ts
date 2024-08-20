import LevelDto from "./LevelDto";

export default interface StudentQuestionDto {
    id: number;
    question: string;
    questionType: string;
    formType: string;
    createdOn: string;
    level: LevelDto | null
}