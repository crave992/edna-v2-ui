import ShareIcon from '@/components/svg/ShareIcon';
import TooltipButton from '@/components/ui/TooltipButton';
import { useFocusContext } from '@/context/FocusContext';
import ClassAssignmentDto from '@/dtos/ClassAssignmentDto';
import Link from 'next/link';

interface TabItem {
  name: string;
  disabled: boolean;
  disabledSupportingText?: string;
}

interface TabsProps {
  tabs: TabItem[];
  selectedTab: string;
  setSelectedTab: Function;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  classes?: ClassAssignmentDto[];
  studentId?: number;
}

const Tabs = ({ tabs, selectedTab, setSelectedTab, isEditing, setIsEditing, classes, studentId }: TabsProps) => {
  const { setClassId, setLevelId, setStudentId } = useFocusContext();
  const { currentUserRoles } = useFocusContext();
  const handleTabChange = (tabName: string) => {
    setSelectedTab(tabName);
    setIsEditing(false);
  };

  return (
    <div className="tw-bg-secondary tw-py-xl tw-border-y tw-border-secondary tw-border-solid tw-border-x-0 tw-w-full">
      <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex tw-items-center tw-justify-between">
        <div className="tw-flex tw-flex-row tw-space-x-xs">
          {tabs &&
            tabs.map((tab: TabItem, index: number) => (
              <button
                key={`${tab.name}-${index}`}
                className={`tw-flex tw-items-center tw-justify-center tw-py-md tw-px-lg tw-rounded-md tw-border-0 tw-text-sm-semibold tw-space-x-md ${
                  selectedTab === tab.name
                    ? 'tw-bg-white tw-shadow tw-text-primary'
                    : selectedTab !== tab.name && !tab.disabled
                    ? 'tw-text-quarterary tw-bg-secondary hover:tw-text-primary hover:tw-bg-white hover:tw-shadow'
                    : 'tw-text-supporting-text tw-bg-secondary'
                }`}
                onClick={() => handleTabChange(tab.name)}
                disabled={tab.disabled}
              >
                <div>{tab.name}</div>
                {tab.disabled && (
                  <TooltipButton
                    text={tab.name == 'Permissions' || tab.name == 'Attendance' ? 'Tab disabled' : 'Coming Soon'}
                    placement="top"
                    supportingText={tab.disabledSupportingText}
                  />
                )}
              </button>
            ))}
        </div>
        <div className="tw-flex tw-space-x-xs">
          {!currentUserRoles?.isParent && (
            <Link
              href="/focus/student"
              className={`${
                classes && classes.length > 0
                  ? 'tw-text-tertiary hover:tw-text-secondary'
                  : 'tw-pointer-events-none tw-text-supporting-text'
              } tw-border-transparent tw-bg-transparent tw-text-sm-semibold tw-flex tw-flex-row tw-space-x-sm tw-items-center tw-justify-between tw-no-underline`}
              aria-disabled={classes && classes.length == 0}
              onClick={() => {
                if (classes && classes.length > 0) {
                  setStudentId(classes[0].studentId);
                  setClassId(classes[0].classId);
                  setLevelId(classes[0].levelId);
                }
              }}
            >
              <div>Open in Focus</div>
              {classes && classes.length > 0 ? (
                <ShareIcon />
              ) : (
                <TooltipButton text="Link disabled" supportingText="Student does not belong to a class." />
              )}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
