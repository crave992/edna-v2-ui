import TooltipButton from '@/components/ui/TooltipButton';

interface TabItem {
  name: string;
  disabled: boolean;
}

interface StaffTabsProps {
  tabs: TabItem[];
  selectedTab: string;
  setSelectedTab: Function;
}

const StaffTabs = ({ tabs, selectedTab, setSelectedTab }: StaffTabsProps) => {
  return (
    <div className="tw-bg-secondary tw-py-xl tw-border-y tw-border-secondary tw-border-solid tw-border-x-0 tw-w-full">
      <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex tw-items-center tw-justify-between">
        <div className="tw-flex tw-flex-row tw-space-x-xs">
          {tabs &&
            tabs.map((tab: TabItem, index: number) => {
              return (
                <button
                  key={`${tab.name}-${index}`}
                  className={`tw-flex tw-items-center tw-justify-center tw-py-md tw-px-lg tw-rounded-md tw-border-0 tw-text-sm-semibold tw-space-x-md ${
                    selectedTab === tab.name
                      ? 'tw-bg-white tw-shadow tw-text-primary'
                      : selectedTab !== tab.name && !tab.disabled
                      ? 'tw-text-quarterary tw-bg-secondary hover:tw-text-primary hover:tw-bg-white hover:tw-shadow'
                      : 'tw-text-supporting-text tw-bg-secondary'
                  }`}
                  onClick={() => setSelectedTab(tab.name)}
                  disabled={tab.disabled}
                >
                  <div>{tab.name}</div>
                  {tab.disabled && (
                    <TooltipButton
                      text={tab.name == 'Permissions' || tab.name == 'Attendance' ? 'Tab disabled' : 'Coming Soon'}
                      placement="top"
                      supportingText={
                        tab.name == 'Permissions'
                          ? "Assign a Level first to adjust this student's permissions."
                          : tab.name == 'Attendance'
                          ? 'Student does not belong to a class.'
                          : ''
                      }
                    />
                  )}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default StaffTabs;
