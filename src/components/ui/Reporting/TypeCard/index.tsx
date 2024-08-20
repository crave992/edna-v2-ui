import React from 'react';
import { useReportingIcons } from '@/hooks/useReportingIcons';

interface TypeCardProps {
  type: { description: string; name: string };
  setShowModal?: Function;
  setType?: Function;
}

const TypeCard = ({ type, setShowModal, setType }: TypeCardProps) => {
  const { description, name } = type;
  const getColor = useReportingIcons;
  const colorProps = getColor(name);

  if (!colorProps) {
    return null;
  }

  const { icon: Icon, color, background } = colorProps;

  const handleClick = () => {
    if (setType) setType(name);
    if (setShowModal) setShowModal(true);
  };

  return (
    <div
      className="tw-p-3xl tw-space-y-3xl tw-rounded-xl tw-border tw-border-solid tw-border-secondary tw-bg-primary tw-shadow-xs tw-flex-1 tw-flex tw-items-center tw-justify-center tw-flex-col sm:tw-max-w-[143px] xl:tw-max-w-none tw-cursor-pointer"
      onClick={() => handleClick()}
    >
      <div className="tw-p-lg tw-rounded-full" style={{ background: background }}>
        <Icon color={color} width={'24'} height={'24'} fill={name === 'Medical' ? '' : background} />
      </div>
      <div className="tw-space-y-md">
        <div className="tw-text-sm-medium tw-text-center tw-text-tertiary tw-invisible">{description}</div> {/*  Added tw-invisible to hide for now */}
        <div className="tw-text-lg-semibold tw-text-center tw-text-primary">{name}</div>
      </div>
    </div>
  );
};

export default TypeCard;
