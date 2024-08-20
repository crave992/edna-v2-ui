export interface ModuleMappingWithUserRoleModel {
    moduleId: number;
    accessType: string;
}

export interface ModuleMappingWithUserRoleListModel {
    roleId: number;
    mapping: ModuleMappingWithUserRoleModel[];
}