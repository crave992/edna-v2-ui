import PaginationParams from "./PaginationParams";

export interface DirectoryListParams extends PaginationParams {
    category: string;
}