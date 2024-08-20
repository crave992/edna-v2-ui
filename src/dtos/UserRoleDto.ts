import { OrganizationDto } from "./OrganizationDto";
import StaffDto from "./StaffDto";

export interface UserRoleDto {
    id: number;
    name: string;
    organizations: OrganizationDto;
    createdOn: Date;
    staffs: StaffDto;
}