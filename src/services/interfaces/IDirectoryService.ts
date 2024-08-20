import Response from "@/dtos/Response";
import { AxiosResponse } from "axios";
import DirectoryListResponseDto from "@/dtos/DirectoryListResponseDto";
import { DirectoryListParams } from "@/params/DirectoryListParams";


export default interface IDirectoryService {
    getAll(p: DirectoryListParams): Promise<AxiosResponse<Response<DirectoryListResponseDto>>>;
}
