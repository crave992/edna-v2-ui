import { lessonTypeColors } from '@/constants/lessonTypeColors';

export interface LevelAreaCardProps {
  lessonType: string;
  css?: string;
  level: string;
}

export default function LevelAreaCard({ lessonType, css, level }: LevelAreaCardProps) {
  const colorScheme = lessonTypeColors[lessonType] || {
    veryDark: '#101828',
    dark: '#344054',
    light: '#F2F4F7',
    medium: '#98A2B3',
    lightMedium: '#EAECF0',
    alertColor: '#667085',
  };
  const { veryDark, dark, light } = colorScheme;

  return (
    <>
      <div
        style={{ backgroundColor: light, borderColor: dark }}
        className={`tw-flex tw-flex-row tw-w-1/3 tw-h-[71px] tw-p-lg tw-rounded-md tw-justify-between tw-cursor-pointer ${css} tw-border-[1.5px] tw-rounded-md tw-border-solid tw-p-lg`}
      >
        <div className={`tw-w-full tw-select-none tw-space-y-sm`}>
          <div className="tw-text-xs-medium" style={{ color: dark }}>
            {level}
          </div>
          <div className="tw-text-sm-regular tw-truncate" style={{ color: veryDark }}>
            {lessonType}
          </div>
        </div>
      </div>
    </>
  );
}
