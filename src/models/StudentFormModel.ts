export interface StudentFormModel {
  id: number;
  name: string;
  docUrl?: string;
  document: FileList;
  levelIds: number[];
}
