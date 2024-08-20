import { QuestionCategoryDto } from "./QuestionCategoryDto";

export interface StudentInputFormDto {
    studentId: number;
    questionId: number;
    question: string;
    questionType: string;
    answer: string | null;
    answerDate: Date | null;
    answerUpdatedDate: Date | null;
    acceptTerms: boolean;
    formType: string;
    category: QuestionCategoryDto | null;
    sequence: number;
}