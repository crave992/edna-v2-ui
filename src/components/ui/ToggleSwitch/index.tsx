import { FC } from 'react';

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({ label, checked, onChange }) => {
  const handleToggle = () => {
    onChange(!checked);
  };

  return (
    <label className="tw-relative tw-inline-flex tw-items-center tw-cursor-pointer">
      <input type="checkbox" className="tw-sr-only tw-peer" checked={checked} onChange={handleToggle} />
      <div className="tw-w-[36px] tw-h-[20px] tw-bg-gray-200 peer-focus:tw-outline-none tw-rounded-full tw-peer peer-checked:after:tw-translate-x-full peer-checked:after:tw-border-white after:tw-content-[''] after:tw-absolute after:tw-top-[1px] after:tw-left-[2px] after:tw-bg-white after:tw-border-gray-300 after:tw-border after:tw-rounded-full after:tw-h-[16px] after:tw-w-[16px] after:tw-transition-all peer-checked:tw-bg-brand-primary"></div>
      <span className="tw-ml-3 tw-text-sm tw-font-medium">{label}</span>
    </label>
  );
};

export default ToggleSwitch;
