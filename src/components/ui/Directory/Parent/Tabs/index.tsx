import ShareIcon from '@/components/svg/ShareIcon';
import TooltipButton from '@/components/ui/TooltipButton';
import Link from 'next/link';

interface TabItem {
  name: string;
  disabled: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  selectedTab: string;
  setSelectedTab: Function;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const Tabs = ({ tabs, selectedTab, setSelectedTab, isEditing, setIsEditing }: TabsProps) => {
  const handleTabChange = (tabName: string) => {
    setSelectedTab(tabName);
    setIsEditing(false);
  };

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
                  onClick={() => handleTabChange(tab.name)}
                  disabled={tab.disabled}
                >
                  <div>{tab.name}</div>
                  {tab.disabled && <TooltipButton text="Coming Soon" placement="top"/>}
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Tabs;
