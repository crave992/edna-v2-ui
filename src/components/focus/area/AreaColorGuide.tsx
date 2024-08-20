import React from 'react';
import { lessonTypeColors } from '@/constants/lessonTypeColors';
import AreaDto from '@/dtos/AreaDto';

interface Areas {
  areas: AreaDto[];
}

const AreaColorGuide = ({ areas }: Areas) => {
  return (
    <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-3 tw-gap-4 tw-py-4 tw-px-4">
      {areas.map((area) => {
        const colorScheme = lessonTypeColors[area.name] || {
          veryDark: '#101828',
          dark: '#344054',
          light: '#F2F4F7',
          medium: '#98A2B3',
          lightMedium: '#EAECF0',
          alertColor: '#667085',
        };

        return (
          <div
            key={area.id}
            className="tw-max-h-[70px] tw-max-w-[184px] tw-flex tw-rounded-md tw-overflow-hidden tw-relative tw-flex tw-items-center tw-justify-left tw-border-2 tw-border-solid"
            style={{ backgroundColor: colorScheme.light, color: colorScheme.veryDark, borderColor: colorScheme.dark }}
          >
            <div className="tw-truncate tw-text-lg tw-font-bold tw-text-center tw-p-4">{area.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default AreaColorGuide;
