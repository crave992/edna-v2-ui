import React, { useState } from 'react';

interface CustomButtonGroupProps {
  buttons: {
    label: string;
    onClick: () => void;
  }[];
  rounded?: string;
}

const CustomButtonGroup: React.FC<CustomButtonGroupProps> = ({ buttons, rounded }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleClick = (index: number, onClick: () => void) => {
    setSelectedIndex(index);
    onClick();
  };

  return (
    <div className="tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center">
      {buttons.map((button, index) => {
        const isFirst = index === 0;
        const isLast = index === buttons.length - 1;
        const isSelected = index === selectedIndex;

        let classes =
          'tw-px-xl tw-py-md tw-border tw-border-solid tw-border-primary tw-cursor-pointer hover:tw-bg-secondary';
        if (isFirst) {
          classes += ` ${rounded === 'xl' ? 'tw-rounded-l-xl' : 'tw-rounded-l-md'}`;
        } else if (isLast) {
          classes += ` ${rounded === 'xl' ? 'tw-rounded-r-xl' : 'tw-rounded-r-md'}`;
        } else {
          classes += ' tw-border-x-0';
        }

        if (isSelected) {
          classes += ' tw-tw-bg-secondary';
        }

        return (
          <div key={index} className={classes} onClick={() => handleClick(index, button.onClick)}>
            {button.label}
          </div>
        );
      })}
    </div>
  );
};

export default CustomButtonGroup;
