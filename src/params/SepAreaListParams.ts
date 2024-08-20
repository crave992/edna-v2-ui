import PaginationParams from "./PaginationParams";

export default interface SepAreaListParams extends PaginationParams {
  levelId: number;
  isForDropDown?: boolean;
}

export interface MasterSepAreaListParams extends PaginationParams {
  masterLevelId: number;
}
