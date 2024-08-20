export default interface TopicModel {
    id: number,
    levelId: number,
    areaId: number,
    name: string,
}

export interface TopicModelBulkUpload {
    levelId: number,
    areaId: number,
    document: FileList,
}