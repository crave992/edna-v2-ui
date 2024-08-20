import { ReactNode } from 'react';

export interface ProfileOptionsProps {
  id: number | string;
  divider?: boolean;
  title?: string;
  link?: string;
  role?: string;
  icon?: string;
  shortcut?: ReactNode;
  onClick?: () => Promise<void>;
  adminLink?: string;
  children?: ProfileOptionsProps[];
}

const profileOptions: ProfileOptionsProps[] = [
  {
    id: 'div-0',
    divider: true,
  },
  {
    id: 'view-profile',
    title: 'View profile',
    link: '/staff',
    icon: '/images/user-circle.svg',
    adminLink: '/directory/staff',
  },
  {
    id: 'change-password',
    title: 'Change Password',
    link: '/account/change-password',
    icon: '/images/passcode.svg',
  },
  // {
  //   id: 'div-1',
  //   divider: true,
  // },
  // {
  //   id: 'time-keeper',
  //   title: 'Time Keeper',
  //   link: '/staff/clock-in-out',
  //   icon: '/images/clock-check.svg',
  //   shortcut: 'T',
  // },
  // {
  //   id: 'calendar',
  //   title: 'Calendar',
  //   link: '',
  //   icon: '/images/calendar-date.svg',
  //   shortcut: 'F',
  // },
  // {
  //   id: 'div-2',
  //   divider: true,
  // },
  {
    id: 'reports',
    title: 'Reports',
    link: '/reporting',
    icon: '/images/file-02.svg',
    shortcut: 'R',
  },
  // {
  //   id: 'messages',
  //   title: 'Messages',
  //   link: '',
  //   icon: '/images/message-text-square-02.svg',
  //   shortcut: 'M',
  // },
  // {
  //   id: 'notifications',
  //   title: 'Notifications',
  //   link: '',
  //   icon: '/images/info-circle.svg',
  //   shortcut: 'K',
  // },
  {
    id: 'div-3',
    divider: true,
  },
];

export default profileOptions;
