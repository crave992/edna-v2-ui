export default interface SepTopicModel {
    id: number,
    levelId: number,
    sepAreaId: number,
    sepLevelId: number,
    name: string,
}

export interface SepTopicModelBulkUpload {
    levelId: number,
    sepAreaId: number,
    sepLevelId: number,
    document: FileList,
}