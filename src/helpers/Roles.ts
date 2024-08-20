export enum Role {
  NooranaAdmin = "NooranaAdmin",
  AccountOwner = "AccountOwner",
  SuperAdmin = "SuperAdmin",
  Admin = "Admin",
  Staff = "Staff",
  Parent = "Parent",    
  Student = "Student",
  All = "All",
}
 export const AccountOwnerRoles = [Role.NooranaAdmin, Role.AccountOwner];
 export const SuperAdminRoles = [...AccountOwnerRoles, Role.SuperAdmin];
 export const AdminRoles = [...SuperAdminRoles, Role.Admin];
 export const StaffRoles = [...AdminRoles, Role.Staff];
 export const AllRoles = [...StaffRoles, Role.Parent];