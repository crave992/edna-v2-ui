import { AdminRoles, AllRoles, Role, StaffRoles } from '@/helpers/Roles';

export interface MenuItemsProp {
  id: string;
  title: string;
  link: string;
  roles?: Role[];
  disabled?: boolean;
  children?: MenuItemsProp[];
  show?: boolean;
}

const menuItems: MenuItemsProp[] = [
  {
    id: 'home',
    title: 'Home',
    link: '/admin/dashboard',
    disabled: false,
    roles: AdminRoles,
    show: true,
  },
  {
    id: 'home2',
    title: 'Home',
    link: '/staff/dashboard',
    disabled: false,
    roles: [Role.Staff],
    show: true,
  },
  {
    id: 'focus',
    title: 'Focus',
    link: '/focus/student',
    roles: StaffRoles,
    show: true,
    children: [
      {
        id: 'student',
        title: 'Student',
        link: '/focus/student',
        disabled: false,
        show: true,
      },
      {
        id: 'lesson',
        title: 'Lesson',
        link: '/focus/lesson',
        disabled: false,
        show: true,
      },
      {
        id: 'class',
        title: 'Class',
        link: '/focus/class',
        disabled: false,
        show: true,
      },
    ],
    disabled: false,
  },
  {
    id: 'student_focus',
    title: 'Focus',
    link: '/student/[id]/focus',
    roles: [Role.Staff],
    show: true,
    children: [
      {
        id: 'student',
        title: 'Student',
        link: '/focus/student',
        disabled: false,
        show: true,
      },
      {
        id: 'lesson',
        title: 'Lesson',
        link: '/focus/lesson',
        disabled: false,
        show: true,
      },
      {
        id: 'class',
        title: 'Class',
        link: '/focus/class',
        disabled: false,
        show: true,
      },
    ],
    disabled: false,
  },
  {
    id: 'directory',
    title: 'Directory',
    link: '/directory/student',
    roles: StaffRoles,
    disabled: false,
    show: true,
    children: [
      {
        id: 'student',
        title: 'Student',
        link: '/directory/student',
        show: true,
      },
      {
        id: 'parent',
        title: 'Parent',
        link: '/directory/parent',
        show: true,
      },
      {
        id: 'staff',
        title: 'Staff',
        link: '/directory/staff',
        show: true,
      },
      {
        id: 'class',
        title: 'Class',
        link: '/directory/class',
        show: true,
      },
    ],
  },
  {
    id: 'reflection',
    title: 'Reflection',
    link: '/reflection',
    disabled: true,
    show: true,
    roles: StaffRoles,
  },
  {
    id: 'observation',
    title: 'Observation',
    link: '/observation',
    disabled: true,
    show: true,
    roles: StaffRoles,
  },
  {
    id: 'my-profile',
    title: 'My Profile',
    link: '/parent/my-profile',
    roles: [Role.Parent],
    disabled: false,
    show: true,
  },
];

export default menuItems;
