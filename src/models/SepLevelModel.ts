export default interface SepLevelModel {
    id: number,
    levelId: number,
    sepAreaId: number,
    name: string,
}

export interface SepLevelModelBulkUpload {
    levelId: number,
    sepAreaId: number,
    document: FileList,
}