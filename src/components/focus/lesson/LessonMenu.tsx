import { lessonTypeColors } from '@/constants/lessonTypeColors';
import { HTMLAttributes, Ref, forwardRef } from 'react';

interface LessonCardProps extends HTMLAttributes<HTMLDivElement> {
  sequence: string | undefined;
  name: string;
  description: string;
  lessonType: string;
  selected: boolean;
  setSelected: (selected: boolean) => void;
  fromClass?: boolean;
  isCustom: boolean | undefined;
}

const LessonMenu = forwardRef((props: LessonCardProps, ref: Ref<HTMLDivElement>) => {
  const {
    name,
    sequence,
    description,
    lessonType,
    selected,
    setSelected,
    fromClass = false,
    isCustom = false,
    ...rest
  } = props;
  const colorScheme = lessonTypeColors[lessonType] || {
    veryDark: '#101828',
    dark: '#344054',
    light: '#F2F4F7',
    medium: '#98A2B3',
    lightMedium: '#EAECF0',
    alertColor: '#667085',
  };
  const { veryDark, dark, light, medium } = colorScheme;

  const toggleSelection = () => {
    setSelected(!selected);
  };

  return (
    <div ref={ref} {...rest} className={`tw-flex tw-flex-row `} onClick={toggleSelection}>
      <div
        style={{ backgroundColor: light, borderColor: dark }}
        className={`tw-w-[170px] tw-h-[87px] tw-p-lg tw-cursor-pointer tw-rounded-md tw-border-solid ${
          selected ? 'tw-border-2' : 'tw-border-1'
        } ${fromClass ? 'tw-border-[1px]' : ''} ${isCustom ? 'tw-border-dashed' : 'tw-border-solid'}`}
      >
        <div className="tw-h-[18px] tw-flex tw-flex-nowrap tw-items-centertw-space-y-sm tw-space-x-xs">
          {sequence && (
            <div style={{ color: dark, backgroundColor: medium }} className="tw-text-xs-medium tw-px-xs tw-rounded-xs">
              {sequence}
            </div>
          )}
          <div style={{ color: dark }} className="tw-truncate tw-p-0 tw-text-xs-medium">
            {name}
          </div>
        </div>
        <p className="tw-line-clamp-2 tw-text-sm-regular" style={{ color: veryDark }}>
          {description}
        </p>
      </div>
    </div>
  );
});

LessonMenu.displayName = 'LessonMenu';

export default LessonMenu;
