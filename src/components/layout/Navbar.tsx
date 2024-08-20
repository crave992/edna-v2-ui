import menuItems, { MenuItemsProp } from '@/constants/menuItems';
import Link from 'next/link';
import { Nav, NavDropdown } from 'react-bootstrap';
import { logout } from '@/components/common/Logout';
import MenuButton from '@/components/ui/MenuButton';
import UserDto from '@/dtos/UserDto';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import ProfileOptions from '@/components/ui/ProfileOptions';
import { Profile } from '@/components/ui/Profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faOption, faUp } from '@fortawesome/pro-regular-svg-icons';
import useImpersonation from '@/hooks/useImpersonation';
import ImageBrand from '@/components/common/ImageBrand';
import SubNavbar from '@/components/layout/SubNavbar';
import AttendanceWidget from '@/components/common/AttendanceWidget';
import AttendanceIcon from '@/components/svg/AttendanceIcon';
import { Role } from '@/helpers/Roles';
import { ChevronDownIcon } from '../svg/ChevronDown';
import IconButton from '../ui/IconButton';
import { useNavbarContext } from '@/context/NavbarContext';
import CustomBadge from '@/components/ui/CustomBadge';
import { useUserRole } from '@/hooks/useUserRole';
import CustomButton from '../ui/CustomButton';
import LogoutIcon from '../svg/Logout';
import { StudentBasicDto } from '@/dtos/StudentDto';
import { useFocusContext } from '@/context/FocusContext';
import { useSession } from 'next-auth/react';
import AlarmIcon from '../svg/AlarmIcon';
import AlertWidget from '../common/AlertWidget';
import { useOrganizationQuery } from '@/hooks/queries/useOrganizationQuery';
import { useClassesQuery } from '@/hooks/queries/useClassesQuery';
import { useParentQuery } from '@/hooks/queries/useParentQuery';
import ClassDto from '@/dtos/ClassDto';

interface NextNavbarProps {
  user: UserDto;
}

const NextNavbar = ({ user }: NextNavbarProps) => {
  const {
    pathname: currentPath,
    query: { id },
  } = useRouter();
  // const { isImpersonatingUser } = useImpersonation();
  const [openDropdown, setOpenDropdown] = useState(false);
  const { activeSubNavId, openSubNavbar, setOpenSubNavbar, setActiveSubNavId } = useNavbarContext();
  const {
    levelId,
    setLevelId,
    classId,
    setClassId,
    currentUserRoles,
    setCurrentUserRoles,
    selectedClass: classData,
    setSelectedClass,
    setClasses,
    setOrganization,
  } = useFocusContext();
  const [openAttendanceWidget, setOpenAttendanceWidget] = useState(false);
  const [openAlarmWidget, setOpenAlarmWidget] = useState(false);
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);
  const [userRole, setUserRole] = useState<string>('');
  const [menuItemsUpdated, setMenuItemsUpdated] = useState<boolean>(false);
  const [userFound, setUserFound] = useState<boolean>(false);
  const [homePage, setHomePage] = useState<string>('');
  const { data: session } = useSession();

  let roleHook = useUserRole();

  const { data: classesData } = useClassesQuery({
    isAdmin:
      currentUserRoles?.hasSuperAdminRoles || currentUserRoles?.hasAccountOwnerRoles || currentUserRoles?.hasAdminRoles,
    staffId: currentUserRoles?.staffId!,
  });

  useEffect(() => {
    if (classesData && classesData.length > 0) {
      setClasses(classesData);
      if (classId == undefined) {
        setClassId(classesData[0].id);
      }
      if (levelId == undefined) {
        setLevelId(classesData[0].levelId);
      }
      if (classData == undefined) {
        setSelectedClass(classesData[0]);
      } else {
        const classFound = classesData?.find((classItem: ClassDto) => classItem.id === classId);
        setSelectedClass(classFound!);
      }
    }
  }, [classesData, classData, classId, levelId]);

  const { data: organization } = useOrganizationQuery(session?.user.organizationId!);
  const { data: parentInfo } = useParentQuery(currentUserRoles?.isParent!);

  const updateMenuItems = () => {
    const directory = menuItems.find((item) => item.id === 'directory');
    if (!currentUserRoles?.hasSuperAdminRoles) {
      directory?.children?.forEach((item) => {
        if (!currentUserRoles?.hasAdminRoles) {
          if (item.id != 'student' && item.id != 'parent') {
            item.show = false;
          }

          if (item.id == 'parent') {
            item.show = currentUserRoles?.isLeadGuide || currentUserRoles?.isLeadAndAssociate;
          }

          if (item.id == 'staff') {
            item.show = !currentUserRoles?.isParent;
          }
        } 
      });
    }

    if (currentUserRoles?.isStaff && !user.hasClass) {
      const items = menuItems.filter((item) => item.id !== 'home');
      items.forEach((menuItem) => {
        menuItem.show = false;
      });
    }

    let homeLink = '';

    if (currentUserRoles?.hasAdminRoles) {
      homeLink = '/admin/dashboard/';
    } else if (currentUserRoles?.isParent) {
      homeLink = '/parent/my-profile/';
    } else {
      if (currentUserRoles?.isStaff) {
        if (currentUserRoles?.isLeadGuide || currentUserRoles?.isAssociateGuide || currentUserRoles?.isSpecialist) {
          homeLink = '/staff/dashboard/';
        } else {
          homeLink = `/staff/${session?.user?.staffId}`;
        }
        const staffHomeMenuItem = menuItems.find((item) => item.id === 'home' && item.link == '/staff/dashboard');
        if (staffHomeMenuItem) {
          staffHomeMenuItem.link = homeLink;
        }
      }
    }

    setHomePage(homeLink);
    setMenuItemsUpdated(true);
  };

  useEffect(() => {
    if (!userFound) return;
    updateMenuItems();
  }, [currentUserRoles, userFound]);

  useEffect(() => {
    if (user) {
      setUserFound(true);
      setCurrentUserRoles({
        canUpdateLesson: roleHook.canUpdateLesson,
        hasSuperAdminRoles: roleHook.hasSuperAdminRoles,
        hasAccountOwnerRoles: roleHook.hasAccountOwnerRoles,
        hasAdminRoles: roleHook.hasAdminRoles,
        isAdmin: roleHook.isAdmin,
        isParent: roleHook.isParent,
        isStaff: roleHook.isStaff,
        isAssociateGuide: roleHook.isAssociateGuide,
        isLeadGuide: roleHook.isLeadGuide,
        isSpecialist: roleHook.isSpecialist,
        isLeadAndAssociate: roleHook.isLeadGuide && roleHook.isAssociateGuide,
        staffId: roleHook.staffId,
        IsNooranaAdmin: roleHook.isNooranaAdmin,
      });
      if (organization) setOrganization(organization);
    }
  }, [user, organization]);

  useEffect(() => {
    if (user && classData && (currentPath.startsWith('/focus') || currentPath.startsWith('/staff/dashboard'))) {
      var roleBadge = '';

      if (currentUserRoles?.isAdmin) {
        roleBadge = 'Admin/';
      } else if (currentUserRoles?.hasAccountOwnerRoles) {
        roleBadge = 'Account Owner/';
      } else if (currentUserRoles?.hasSuperAdminRoles) {
        roleBadge = 'Super Admin/';
      }

      if (classData?.classStaff.some((staff) => staff.id === user.staffId && staff.type == 1)) {
        roleBadge =
          roleBadge + organization && organization?.termInfo && organization?.termInfo?.teacher
            ? organization.termInfo.teacher
            : 'Guide';
        setUserRole(roleBadge);
        setCurrentUserRoles({
          canUpdateLesson: true,
          hasSuperAdminRoles: currentUserRoles?.hasSuperAdminRoles,
          hasAccountOwnerRoles: currentUserRoles?.hasAccountOwnerRoles,
          hasAdminRoles: currentUserRoles?.hasAdminRoles,
          isAdmin: currentUserRoles?.isAdmin,
          isParent: currentUserRoles?.isParent,
          isStaff: currentUserRoles?.isStaff,
          isAssociateGuide: false,
          isLeadGuide: true,
          isSpecialist: false,
          isLeadAndAssociate: currentUserRoles?.isLeadAndAssociate,
          staffId: currentUserRoles?.staffId ?? null,
          IsNooranaAdmin: currentUserRoles?.IsNooranaAdmin,
        });
      } else if (classData?.classStaff.some((staff) => staff.id === user.staffId && staff.type == 2)) {
        roleBadge =
          roleBadge + organization && organization?.termInfo && organization?.termInfo?.assistant
            ? organization.termInfo.assistant
            : 'Associate';
        setUserRole(roleBadge);
        setCurrentUserRoles({
          canUpdateLesson: false,
          hasSuperAdminRoles: currentUserRoles?.hasSuperAdminRoles,
          hasAccountOwnerRoles: currentUserRoles?.hasAccountOwnerRoles,
          hasAdminRoles: currentUserRoles?.hasAdminRoles,
          isAdmin: currentUserRoles?.isAdmin,
          isParent: currentUserRoles?.isParent,
          isStaff: currentUserRoles?.isStaff,
          isAssociateGuide: true,
          isLeadGuide: false,
          isSpecialist: false,
          isLeadAndAssociate: currentUserRoles?.isLeadAndAssociate,
          staffId: currentUserRoles?.staffId ?? null,
          IsNooranaAdmin: currentUserRoles?.IsNooranaAdmin,
        });
      } else if (classData?.classStaff.some((staff) => staff.id === user.staffId && staff.type == 3)) {
        roleBadge =
          roleBadge + organization && organization?.termInfo && organization?.termInfo?.specialist
            ? organization.termInfo.specialist
            : 'Specialist';
        setUserRole(roleBadge);

        setCurrentUserRoles({
          canUpdateLesson: true,
          hasSuperAdminRoles: currentUserRoles?.hasSuperAdminRoles,
          hasAccountOwnerRoles: currentUserRoles?.hasAccountOwnerRoles,
          hasAdminRoles: currentUserRoles?.hasAdminRoles,
          isAdmin: currentUserRoles?.isAdmin,
          isParent: currentUserRoles?.isParent,
          isStaff: currentUserRoles?.isStaff,
          isAssociateGuide: false,
          isLeadGuide: false,
          isSpecialist: true,
          isLeadAndAssociate: currentUserRoles?.isLeadAndAssociate,
          staffId: currentUserRoles?.staffId ?? null,
          IsNooranaAdmin: currentUserRoles?.IsNooranaAdmin,
        });
      } else {
        setCurrentUserRoles({
          canUpdateLesson: currentUserRoles?.hasAccountOwnerRoles,
          hasSuperAdminRoles: currentUserRoles?.hasSuperAdminRoles,
          hasAccountOwnerRoles: currentUserRoles?.hasAccountOwnerRoles,
          hasAdminRoles: currentUserRoles?.hasAdminRoles,
          isAdmin: currentUserRoles?.isAdmin,
          isParent: currentUserRoles?.isParent,
          isStaff: currentUserRoles?.isStaff,
          isAssociateGuide: false,
          isLeadGuide: false,
          isSpecialist: false,
          isLeadAndAssociate: currentUserRoles?.isLeadAndAssociate,
          staffId: currentUserRoles?.staffId ?? null,
          IsNooranaAdmin: currentUserRoles?.IsNooranaAdmin,
        });
      }
    } else if (user != undefined && user != null && organization != null && organization != undefined) {
      var role = user.roles[0];
      var roleName = '';
      if (role != null) {
        switch (role.name) {
          case 'NooranaAdmin':
            roleName = 'Noorana Admin';
            break;
          case 'AccountOwner':
            roleName = 'Account Owner';
            break;
          case 'SuperAdmin':
            roleName = 'Super Admin';
            break;
          default:
            roleName = role.name;
        }
        setUserRole(roleName);
      }
    }
  }, [user, organization, classData, currentPath]);

  const handleCloseAttendance = () => {
    setOpenAttendanceWidget(false);
  };

  const handleCloseAlarm = () => {
    setOpenAlarmWidget(false);
  };

  const handleOpen = (widget: string) => {
    if (widget === 'attendance') {
      setOpenAttendanceWidget(!openAttendanceWidget);
    } else if (widget === 'alarm') {
      setOpenAlarmWidget(!openAlarmWidget);
    } else {
      return;
    }
  };

  const userHasAccessToMenuItem = (menuItem: MenuItemsProp): boolean => {
    if (!menuItem.roles || menuItem.roles.length === 0) {
      return true;
    }

    var hasAccess = user?.roles.some((userRole) => menuItem.roles!.includes(userRole.name as Role) && menuItem.show);
    return hasAccess;
  };

  const childMenuItems = useMemo(
    () =>
      parentInfo &&
      parentInfo.students &&
      parentInfo?.students.length > 0 &&
      parentInfo?.students.map((student: StudentBasicDto) => {
        return {
          id: String(student.id),
          title: student.nickName ? student.nickName : student.firstName,
          link: `/parent/my-children/${student.id}`,
          disabled: false,
          show: true,
        };
      }),
    [parentInfo, id]
  );

  const displayName = useMemo(() => {
    if (parentInfo?.students) {
      return parentInfo?.students[0]?.nickName ? parentInfo?.students[0]?.nickName : parentInfo?.students[0]?.firstName;
    }
  }, [parentInfo, id]);

  const childrenMenuItem = {
    id: 'my-children',
    title:
      parentInfo?.students && parentInfo?.students.length == 1
        ? `${displayName}${
            displayName.charAt(displayName.length - 1).toLowerCase() == 's' ||
            displayName.charAt(displayName.length - 1).toLowerCase() == 'x'
              ? "'"
              : "'s"
          } Profile`
        : 'Children',
    link:
      parentInfo && parentInfo.students && parentInfo?.students.length > 0
        ? `/parent/my-children/${parentInfo?.students[0].id}`
        : '',
    roles: [Role.Parent],
    disabled: false,
    show: parentInfo && parentInfo.students && parentInfo?.students.length > 0,
    children: parentInfo && parentInfo.students && parentInfo?.students.length > 0 ? childMenuItems : null,
  };

  const updatedMenuItems =
    currentUserRoles?.isParent && parentInfo && parentInfo?.students && parentInfo?.students.length > 0
      ? [...menuItems, childrenMenuItem]
      : menuItems;

  const accessibleMenuItems = useMemo(() => {
    return updatedMenuItems.filter((item) => userHasAccessToMenuItem(item));
  }, [updatedMenuItems, user, menuItems, menuItemsUpdated, childMenuItems]);

  useEffect(() => {
    let hasChildren = false;
    updatedMenuItems.find((item) => {
      if (
        (currentPath.startsWith(item.link) ||
          currentPath.split('/')[1] === item.id ||
          (currentPath.startsWith('/parent/my-children') && currentPath.split('/')[2] === item.id)) &&
        item.hasOwnProperty('children')
      ) {
        hasChildren = true;
      }
    });

    setOpenSubNavbar(hasChildren);
  }, [currentPath]);
  return (
    <>
      <nav className="tw-border-b tw-border-secondary tw-border-solid tw-border-t-0 tw-border-l-0 tw-border-r-0 tw-min-h-[64px] tw-py-lg">
        <div className="tw-min-w-[1016px] tw-mx-4xl tw-w-full tw-flex tw-items-center tw-justify-between">
          <div className="tw-flex tw-flex-row tw-space-x-xl">
            <Link href={homePage}>
              <ImageBrand size={39} />
            </Link>
            <div className="tw-flex tw-flex-row tw-gap-x-md" aria-controls="collapse-navbar">
              {accessibleMenuItems &&
                accessibleMenuItems.map((item) => {
                  if (item.id !== 'student_focus') {
                    return (
                      <Link
                        key={item.id}
                        href={{
                          pathname:
                            item.link.split('/')[1] == currentPath.split('/')[1] &&
                            Number.isNaN(currentPath.split('/')[2])
                              ? '#'
                              : item.link,
                        }}
                        aria-controls="collapse-navbar"
                        onClick={() => {
                          if (item.children) {
                            setActiveSubNavId(item.id);
                            // setOpenSubNavbar(!openSubNavbar);
                          } else {
                            setActiveSubNavId(item.id);
                            // setOpenSubNavbar(false);
                          }
                        }}
                        aria-disabled={item.disabled}
                        className={`tw-no-underline ${item.disabled && 'tw-pointer-events-none'}`}
                      >
                        <MenuButton
                          key={item.id}
                          disabled={item.disabled}
                          active={
                            currentPath.startsWith(item.link) ||
                            currentPath.split('/')[1] === item.id ||
                            (currentPath.startsWith('/parent/my-children') && currentPath.split('/')[2] === item.id)
                          }
                          name={item.title}
                          hasDropdown={false}
                          openDropdown={activeSubNavId == 'home' || (openSubNavbar && item.id === activeSubNavId)}
                          data-te-collapse-init
                          data-te-ripple-init
                          data-te-ripple-color="light"
                          data-te-target="#collapseExample"
                          aria-expanded="false"
                          aria-controls="collapseExample"
                        />
                      </Link>
                    );
                  }
                })}
            </div>
          </div>
          {currentUserRoles?.isParent ? (
            <div className="tw-mr-4xl">
              <Nav className="tw-gap-x-md tw-mr-4xl">
                <Nav.Item className="tw-flex tw-gap-x-md">
                  <CustomButton
                    onClick={logout}
                    text="Log Out"
                    btnSize={'sm'}
                    heirarchy="secondary-gray"
                    iconTrailing={<LogoutIcon />}
                  />
                </Nav.Item>
              </Nav>
            </div>
          ) : (
            <div className="tw-mr-4xl">
              <Nav className="tw-gap-x-md">
                {/* <Nav.Item className="tw-flex tw-gap-x-md">
                  <IconButton
                    buttonSize="md"
                    className={`tw-border-button-secondary tw-cursor-pointer tw-bg-white`}
                    onClick={() => handleOpen('alarm')}
                    ref={setButtonRef}
                    disabled={false}
                  >
                    <AlarmIcon fill="primary" borderColor="secondary" />
                  </IconButton>
                </Nav.Item> */}
                <Nav.Item className="tw-flex tw-gap-x-md">
                  <IconButton
                    buttonSize="md"
                    className={`tw-border-button-secondary tw-cursor-pointer tw-bg-white`}
                    onClick={() => handleOpen('attendance')}
                    ref={setButtonRef}
                    disabled={false}
                  >
                    <AttendanceIcon fill="primary" borderColor="secondary" />
                  </IconButton>
                </Nav.Item>
                <NavDropdown
                  id="user-nav"
                  title={
                    <div className="tw-flex tw-justify-between tw-items-center tw-rounded-md tw-space-x-xs tw-z-100">
                      <div className="tw-text-sm-semibold tw-text-secondary tw-px-xxs">
                        {/* {isImpersonatingUser ? 'Auditing User as: ' + user?.fullName : user?.fullName} */}
                        {user?.fullName}
                      </div>
                      {userRole !== '' && (
                        <CustomBadge size="sm" type="badge-color" color="brand">
                          {userRole}
                        </CustomBadge>
                      )}
                      <div className="tw-ml-2 xs:tw-mr-2 sm:tw-mr-2">
                        <div
                          className={`tw-transform tw-transition-all tw-duration-200 tw-ease-in-out ${
                            openDropdown ? 'tw-rotate-180' : ''
                          }`}
                        >
                          <ChevronDownIcon stroke="var(--color-primary)" width={20} height={20} />
                        </div>
                      </div>
                    </div>
                  }
                  align="end"
                  className="
                    tw-mr-4xl
                    nav-dropdown
                    tw-border
                    tw-border-solid
                    tw-border-button-secondary
                    tw-text-sm-semibold
                    tw-text-secondary
                    tw-rounded-md
                    tw-h-[40px]
                    hover:tw-bg-primary-hover
                  "
                  onToggle={() => setOpenDropdown(!openDropdown)}
                >
                  <div className="tw-w-full -tw-mt-md">
                    <Profile user={user} />
                    <ProfileOptions />
                    <NavDropdown.Item onClick={logout} className="hover:tw-bg-active tw-px-sm tw-py-[1px] tw-bg-white">
                      <div className=" tw-flex tw-justify-between tw-py-9px tw-px-10px">
                        <div className="tw-flex tw-justify-start tw-space-x-md">
                          <LogoutIcon />
                          <div className="tw-text-sm-medium tw-text-secondary">
                            {/* {isImpersonatingUser ? 'Exit Audit' : 'Logout'} */}
                            Logout
                          </div>
                        </div>
                        <div>
                          <div className="tw-text-xs-regular tw-text-quarterary">
                            <FontAwesomeIcon icon={faOption} size="xs" />
                            <FontAwesomeIcon icon={faUp} size="xs" />Q
                          </div>
                        </div>
                      </div>
                    </NavDropdown.Item>
                  </div>
                </NavDropdown>
              </Nav>
            </div>
          )}
        </div>
      </nav>
      {/* <nav className="tw-bg-white tw-fixed tw-w-full tw-z-20 tw-border-b tw-border-secondary tw-border-solid tw-border-t-0 tw-border-l-0 tw-border-r-0 tw-min-h-[64px] tw-py-[12px] tw-px-[32px]">
        <div className="container tw-flex tw-justify-between tw-mx-auto tw-p-0 tw-h-[36px]">
          <div className="tw-flex tw-justify-start">
            <a href="/" className="tw-flex tw-p-0 tw-w-[51px]">
              <ImageBrand />
            </a>
            <div className="!tw-visible tw-hidden tw-w-full sm:tw-flex sm:tw-w-auto sm:tw-order-1" id="navbar-sticky">
              <ul className="">
                {menuItems &&
                  menuItems.map((item) => {
                    return (
                      <Link
                        key={item.id}
                        href={`${item.link}`}
                        aria-controls="collapse-navbar"
                        onClick={() => {
                          if(item.children){
                            setOpenSubNavbar(true);
                          } else {
                            setOpenSubNavbar(false);
                          }
                        }}
                      >
                        <MenuButton
                          className={
                            currentPath.startsWith(item.link) || currentPath.split("/")[1] === item.id ?
                              'tw-border-primary [&.active]:tw-bg-active active tw-text-secondary-hover' : 'tw-border-transparent tw-text-secondary'
                          }>
                          {item.title}
                        </MenuButton>
                      </Link>
                    );
                  })}
              </ul>
            </div>
          </div>
          <div className="tw-flex tw-justify-end sm:tw-order-last tw-relative tw-inline-block tw-text-left">
            <div>
              <button
                type="button"
                className="tw-h-[40px] tw-border tw-border-solid tw-border-secondary tw-bg-white tw-text-primary tw-rounded-md tw-py-[10px] tw-px-[14px]"
                onClick={() => setOpenDropdown(!openDropdown)}
                id="menu-button" aria-expanded="true" aria-haspopup="true"
              >
                <div className="tw-flex tw-flex-nowrap tw-justify-between tw-gap-x-[4px] tw-align tw-content-center tw-text-secondary">
                  <div>
                    {isImpersonatingUser ? 'Auditing User as: '+user?.fullName : user?.fullName}
                  </div>
                  <div>
                    <FontAwesomeIcon icon={openDropdown ? faAngleUp : faAngleDown}/>
                  </div>
                </div>
              </button>
            </div>
            <div className="tw-absolute tw-right-0 tw-z-10 tw-mt-2 tw-w-56 tw-origin-top-right tw-rounded-md tw-bg-white tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 focus:tw-outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
              <div className="py-1" role="none">
                <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" id="menu-item-0">Account settings</a>
                <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" id="menu-item-1">Support</a>
                <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" id="menu-item-2">License</a>
                <form method="POST" action="#" role="none">
                  <button type="submit" className="text-gray-700 block w-full px-4 py-2 text-left text-sm" role="menuitem" id="menu-item-3">Sign out</button>
                </form>
              </div>
            </div>
            <button data-collapse-toggle="navbar-sticky" type="button" className="tw-inline-flex tw-items-center tw-p-2 tw-w-10 tw-h-10 tw-ml-1 tw-justify-center tw-text-sm tw-text-secondary tw-rounded-lgtw-h-[40px] tw-border tw-border-solid tw-border-secondary tw-bg-white tw-text-primary tw-rounded-md sm:tw-hidden hover:tw-bg-gray-100 focus:tw-outline-none focus:ring-2 focus:tw-ring-gray-200" aria-controls="navbar-sticky" aria-expanded="false">
              <span className="tw-sr-only">Open main menu</span>
              <svg className="tw-w-5 tw-h-5" aria-hidden="true" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
              </svg>
            </button>
          </div>
        </div>
      </nav> */}
      {!currentUserRoles?.isParent && currentPath !== '/staff/dashboard' && currentPath !== '/staff/[id]' ? (
        <SubNavbar
          open={openSubNavbar}
          menuItems={
            updatedMenuItems.find((item) => currentPath.startsWith(item.link) || currentPath.split('/')[1] === item.id)
              ?.children || []
          }
        />
      ) : (
        parentInfo &&
        parentInfo.students &&
        parentInfo.students.length > 1 && (
          <SubNavbar
            open={openSubNavbar}
            menuItems={
              updatedMenuItems.find(
                (item) =>
                  currentPath.startsWith(item.link) ||
                  currentPath.split('/')[1] === item.id ||
                  (currentPath.startsWith('/parent/my-children') && currentPath.split('/')[2] === item.id)
              )?.children || []
            }
          />
        )
      )}
      {openAttendanceWidget && (
        <AttendanceWidget
          openAttendanceWidget={openAttendanceWidget}
          handleClose={handleCloseAttendance}
          buttonRef={buttonRef}
        />
      )}
      {openAlarmWidget && (
        <AlertWidget openAlarmWidget={openAlarmWidget} handleClose={handleCloseAlarm} buttonRef={buttonRef} />
      )}
    </>
  );
};

export default NextNavbar;
