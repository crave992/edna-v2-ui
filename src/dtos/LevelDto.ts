import { OrganizationTypeDto } from "./OrganizationDto";

export default interface LevelDto {
    id: number;
    name: string;
    fromAge: string;
    toAge: string;
    createdOn: Date;
    updatedOn: Date;
    referenceId: number;
    organizationTypeId: number;
    organizationTypeName: string;
    organizationType: OrganizationTypeDto;
}

export interface LevelListResponseDto {
    totalRecord: number;
    levels: LevelDto[];
}
