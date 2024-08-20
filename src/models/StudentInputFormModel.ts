export default interface StudentInputFormModel {
    studentId: number;
    formType: string;
    questions: StudentInputFormAnsweredQuestionModel[]
}

export interface StudentInputFormAnsweredQuestionModel {
    questionId: number;
    questionType: string;
    answer: string;
    acceptTerms: boolean;
}