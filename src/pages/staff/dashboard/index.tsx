import ClassProfile from '@/pages/directory/class/[id]';
import { useFocusContext } from '@/context/FocusContext';

const StaffDashboardPage = () => {
  const { classId, selectedClass } = useFocusContext();

  return <ClassProfile classId={classId ? classId : selectedClass?.id} />;
};

export default StaffDashboardPage;
