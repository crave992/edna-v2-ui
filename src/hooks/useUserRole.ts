import { useSession } from 'next-auth/react';
import { AccountOwnerRoles, AdminRoles, Role, SuperAdminRoles } from '@/helpers/Roles';

export const useUserRole = () => {
  const { data: session } = useSession();

  let hasSuperAdminRoles = false;
  let hasAdminRoles = false;
  let hasAccountOwnerRoles = false;
  let isNooranaAdmin = false;
  let isStaff = false;
  let canUpdateLesson = true;
  let isAssociateGuide = true;
  let isLeadGuide = false;
  let isParent = false;
  let isSpecialist = true;
  let isAdmin = false;
  let staffId: number | null = 0;

  if (session && session.user) {
    const user = session.user;
    const roles = (user?.roles || []).map((el) => el.name);

    hasSuperAdminRoles = SuperAdminRoles.some((role) => roles.includes(role));
    hasAccountOwnerRoles = AccountOwnerRoles.some((role) => roles.includes(role));
    hasAdminRoles = AdminRoles.some((role) => roles.includes(role));

    isNooranaAdmin = roles.includes(Role.NooranaAdmin);
    isParent = roles.includes(Role.Parent);
    isStaff = roles.includes(Role.Staff);
    isAdmin = roles.includes(Role.Admin);
    isAssociateGuide = user.isAssociateGuide ?? false;
    isLeadGuide = user.isLeadGuide ?? false;
    isSpecialist = user.isSpecialist ?? false;
    canUpdateLesson = hasAccountOwnerRoles || (isStaff && (isLeadGuide || isSpecialist));
    staffId = user.staffId;
  }

  return {
    canUpdateLesson,
    hasSuperAdminRoles,
    hasAccountOwnerRoles,
    hasAdminRoles,
    isAdmin,
    isParent,
    isStaff,
    session,
    isAssociateGuide,
    isLeadGuide,
    isSpecialist,
    staffId,
    isNooranaAdmin,
  };
};
