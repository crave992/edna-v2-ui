import { ParentInviteResultDto, ParentInviteIsValidResponseDto, ParentInviteParamsDto} from '@/dtos/ParentInviteDto'
import { AxiosResponse } from "axios";
import Response from "@/dtos/Response";

export default interface IParentInviteService {
    isValidInviteCode(code: string): Promise<AxiosResponse<Response<ParentInviteIsValidResponseDto>>>;
    inviteParent(params: ParentInviteParamsDto): Promise<AxiosResponse<Response<ParentInviteResultDto[]>>>;
}