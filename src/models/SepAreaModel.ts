export default interface SepAreaModel {
    id: number,
    levelId: number,
    name: string,
}

export interface SepAreaModelBulkUpload {
    levelId: number,
    document: FileList,
}