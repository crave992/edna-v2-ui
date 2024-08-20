import { FC } from 'react';

interface ToggleTabProps {
  selected: string;
  onChange: (selected: string) => void;
}

const ToggleSwitch: FC<ToggleTabProps> = ({ selected, onChange }) => {
  const handleToggle = () => {
    onChange(selected);
  };

  return (
    <>
      <label className="tw-border tw-border-[#EAECF0] tw-border-solid tw-grid-cols-2 tw-grid tw-bg-[#F9FAFB] tw-gap-x-2 tw-themeSwitcherTwo tw-w-full tw-shadow-card tw-relative tw-inline-flex tw-cursor-pointer tw-select-none tw-items-center tw-justify-center tw-rounded-md tw-p-1">
        <input
          type="checkbox"
          className="tw-sr-only"
          checked={selected === 'all' ? false : true}
          onChange={handleToggle}
        />
        <div
          className={`tw-justify-center tw-text-center tw-flex tw-items-center tw-space-x-[6px] tw-rounded tw-py-2 tw-px-[18px] tw-text-sm tw-font-semibold ${
            selected === 'planned' ? 'tw-shadow-sm tw-text-[#344054] tw-bg-white' : 'tw-text-[#667085]'
          }`}
        >
          Planned
        </div>
        <div
          className={`tw-justify-center tw-text-center tw-flex tw-items-center tw-space-x-[6px] tw-rounded tw-py-2 tw-px-[18px] tw-text-sm tw-font-semibold ${
            selected === 'all' ? 'tw-shadow-sm tw-text-[#344054] tw-bg-white' : 'tw-text-[#667085]'
          }`}
        >
          All
        </div>
      </label>
    </>
  );
};

export default ToggleSwitch;
