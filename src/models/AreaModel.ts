export default interface AreaModel {
    id: number,
    levelId: number,
    name: string
}
export interface AreaModelBulkUpload {
    levelId: number,
    document: FileList,
}