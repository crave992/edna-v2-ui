export interface ParentInviteResultDto {
    success: boolean;
    message: string;
}

export interface ParentInviteIsValidResponseDto {
    isValid:boolean;
    email:string;
    code:string;
}

export interface ParentInviteParamsDto {
    email: string;
    studentId: number;
    organizationId:number;
}