import PaginationParams from "./PaginationParams";

export default interface SepLevelListParams extends PaginationParams {
  levelId: number;
  sepAreaId: number;
  isForDropDown?: boolean;
}
export interface MasterSepLevelListParams extends PaginationParams {
  masterLevelId: number;
  masterSepAreaId: number;
  isForDropDown?: boolean;
}
