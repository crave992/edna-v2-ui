import React from 'react';

interface TabProps {
  name: string;
  activeTab: string;
  setActiveTab: Function;
}

const Tab: React.FC<TabProps> = ({ name, activeTab, setActiveTab }) => {
  return (
    <div
      className={`tw-flex-1 tw-text-center tw-py-md tw-rounded-sm tw-text-sm-semibold tw-text-quarterary tw-cursor-pointer
        ${activeTab === name && 'tw-text-secondary tw-bg-primary tw-shadow-[0_1px_3px_0px_rgba(16,24,40,0.10)]'}`}
      onClick={() => setActiveTab(name)}
    >
      {name}
    </div>
  );
};

export default Tab;
