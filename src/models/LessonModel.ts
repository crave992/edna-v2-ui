export default interface LessonModel {
    id: number,
    name: string;
    sequenceName: string | null;
    description: string;
    materialUsed: string;
    levelId: number;
    areaId: number;
    topicId: number;
    sequenceNumber: number;
    sequentialAssignment: string;
}

export interface AssignStudentInLessonModel {
    classId: number;
    lessonId: number;
    studentId: number;
}

export interface LessonModelBulkUpload {
    levelId: number,
    areaId: number,
    topicId:number,
    document: FileList,
}