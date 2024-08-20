import React, { useState } from 'react';
import Tab from '@/components/common/Tabs/Tab';

interface TabsProps {
  tabNames: string[];
  activeTab: string;
  setActiveTab: Function;
}

const Tabs: React.FC<TabsProps> = ({ tabNames, activeTab, setActiveTab }) => {
  return (
    <div className="tw-flex tw-items-center tw-gap-xs tw-p-xs tw-rounded-lg tw-my-xl tw-border-secondary tw-bg-secondary tw-border-1 tw-border-solid">
      {tabNames.map((name) => (
        <Tab key={name} name={name} activeTab={activeTab} setActiveTab={setActiveTab} />
      ))}
    </div>
  );
};

export default Tabs;
