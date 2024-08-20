import BackPackIcon from '@/components/svg/BackPackIcon';
import EmergencyIcon from '@/components/svg/EmergencyIcon';
import GlobalSlatedIcon from '@/components/svg/GlobalSlated';
import HomeIcon from '@/components/svg/HomeIcon';
import UserCircleIcon from '@/components/svg/UserCircleIcon';
import UserIcon from '@/components/svg/UserIcon';
import UsersIcon from '@/components/svg/UsersIcon';

export const useReportingIcons = (type: string) => {
  switch (type) {
    case 'Medical':
      return { color: '#D92D20', background: '#FEE4E2', icon: EmergencyIcon };
    case 'Academic':
      return { color: '#CA8504', background: '#FEFBE8', icon: GlobalSlatedIcon };
    case 'Attendance':
      return { color: '#99F6E0', background: '#F0FDF9', icon: UsersIcon };
    case 'Students':
      return { color: '#0086C9', background: '#F0F9FF', icon: UserIcon };
    case 'Parents':
      return { color: '#155EEF', background: '#EFF4FF', icon: HomeIcon };
    case 'Staff':
      return { color: '#7839EE', background: '#F5F3FF', icon: UserCircleIcon };
    case 'Class':
      return { color: '#BA24D5', background: '#FDF4FF', icon: BackPackIcon };
    default:
      return undefined;
  }
};
