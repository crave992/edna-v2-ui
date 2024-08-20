import { useState } from 'react';
import { useClickOutside } from '@mantine/hooks';
import DropdownChevron from '@/components/svg/DropdownChevron';
import USAIcon from '@/components/svg/USAIcon';
import PuertoRicoIcon from '@/components/svg/PuertoRicoIcon';
import CanadaIcon from '@/components/svg/CanadaIcon';
import UserIcon from '@/components/svg/UserIcon';
import StatusDot from '@/components/svg/StatusDot';
import Avatar from '@/components/ui/Avatar';
import CheckIcon from '@/components/svg/CheckIcon';

interface Item {
  id: number;
  name: string;
  staffId?: number;
  [key: string]: any;
}

interface UncontrolledDropdownProps {
  data: Item[];
  component: string;
  selectedItems: { name: string; [key: string]: any } | null;
  options?: { name: string; [key: string]: any }[];
  setSelectedItems: Function;
  containerClassName?: string;
  withIcon?: boolean;
  placeHolderIcon?: string;
  withStatusDot?: boolean;
  withProfile?: boolean;
  index?: number;
  selectedGuide?: Item | null;
  removeSelection?: boolean;
  dropdownClassName?: string;
  textClassName?: string;
  iconColor?: string;
  iconSize?: string;
  anchorRight: boolean;
}

const UncontrolledDropdown = ({
  data,
  component,
  selectedItems,
  setSelectedItems,
  containerClassName,
  withIcon,
  placeHolderIcon,
  withStatusDot,
  withProfile,
  index = undefined,
  options = [],
  dropdownClassName,
  textClassName,
  iconColor,
  iconSize,
  anchorRight,
}: UncontrolledDropdownProps) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const dropdownRef = useClickOutside(() => setIsOpenDropdown(false));

  const handleSelectItem = (item: Item) => {
    if (index !== undefined && index >= 0) {
      let optionsCopy = [...options];
      optionsCopy[index] = item;
      setSelectedItems(optionsCopy);
    } else {
      setSelectedItems(item);
    }

    setIsOpenDropdown(false);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'UNITED STATES':
        return <USAIcon />;
      case 'PUERTO RICO':
        return <PuertoRicoIcon />;
      case 'CANADA':
        return <CanadaIcon />;
      case 'user':
        return <UserIcon />;
    }
  };

  const getStatusIcon = (name: string) => {
    switch (name) {
      case 'Present':
        return <StatusDot fill="success" />;
      case 'Tardy':
        return <StatusDot fill="warning" />;
      case 'Absent':
        return <StatusDot fill="error" />;
      case 'Released':
        return <StatusDot fill="brand" />;
    }
  };

  return (
    <div className="tw-flex tw-items-start tw-justify-center tw-flex-col">
      <div className="tw-relative tw-w-full" ref={dropdownRef}>
        <button
          type="button"
          className={`tw-h-[36px] tw-flex tw-space-x-md tw-text-sm-medium tw-text-secondary-hover tw-justify-between tw-w-full tw-py-10px tw-px-14px tw-border tw-border-primary tw-border-solid tw-rounded-md tw-bg-white tw-items-center ${containerClassName}`}
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsOpenDropdown(!isOpenDropdown)}
        >
          <div className="tw-flex tw-items-center tw-justify-start">
            {selectedItems && withIcon && getIcon(selectedItems.name)}
            {((withProfile && placeHolderIcon && (!selectedItems || (selectedItems && selectedItems.name === ''))) ||
              (placeHolderIcon && !withProfile)) &&
              getIcon(placeHolderIcon)}
            {selectedItems && withStatusDot && getStatusIcon(selectedItems.name)}
            {selectedItems && selectedItems.name !== '' ? (
              <div
                className={`tw-text-sm-medium tw-text-secondary-hover ${textClassName} ${
                  withProfile && 'tw-text-md-medium tw-gap-x-md tw-flex tw-justify-start tw-items-center'
                }`}
              >
                {withProfile && (
                  <Avatar
                    link={selectedItems.profilePicture}
                    photoSize={24}
                    alt={selectedItems.name}
                    firstName={selectedItems.firstName}
                    lastName={selectedItems.lastName}
                  />
                )}
                {selectedItems.name}
                {withProfile && selectedItems.name !== '' && (
                  <span className="tw-text-md-regular tw-text-tertiary">@{selectedItems.firstName.toLowerCase()}</span>
                )}
              </div>
            ) : (
              <div className="tw-text-placeholder">{component}</div>
            )}
          </div>

          {data && data.length > 1 && (
            <div className="tw-flex">
              <div
                className={`tw-transform tw-transition-all tw-duration-300 tw-ease-in-out ${
                  isOpenDropdown ? 'tw-rotate-180' : ''
                }`}
              >
                <DropdownChevron color={iconColor} width={iconSize} height={iconSize} />
              </div>
            </div>
          )}
        </button>
        {isOpenDropdown && data && data.length > 1 && (
          <div
            className={`tw-absolute ${
              anchorRight ? 'tw-right-0' : 'tw-left-0'
            } tw-z-[60] tw-py-xs tw-mt-sm tw-rounded-md tw-bg-white tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-focus:outline-none ${dropdownClassName}`}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="tw-pl-sm tw-max-h-[250px] tw-overflow-y-scroll custom-thin-scrollbar" role="none">
              {data &&
                data.map((item: Item, index: number) => {
                  return (
                    <div
                      className={`tw-h-[36px] tw-text-sm-medium tw-text-secondary-hover tw-px-md tw-py-10px tw-rounded-sm tw-cursor-pointer tw-flex tw-items-center hover:tw-bg-secondary tw-justify-between ${
                        withProfile && 'tw-text-md-medium tw-gap-x-md'
                      }`}
                      role="menuitem"
                      id={`menu-item-${index}`}
                      key={`menu-item-${index}`}
                      onClick={() => handleSelectItem(item)}
                    >
                      <div className={`${withProfile || (withIcon && 'tw-gap-x-md')} tw-flex tw-flex-row tw-py-[1px]`}>
                        {withIcon && getIcon(item.name)}
                        {withStatusDot && getStatusIcon(item.name)}
                        {withProfile && (
                          <Avatar
                            link={item.profilePicture}
                            photoSize={24}
                            alt={item.name}
                            firstName={item.firstName}
                            lastName={item.lastName}
                          />
                        )}
                        {item.name}
                        {withProfile && (
                          <span className="tw-text-md-regular tw-text-tertiary">@{item.firstName.toLowerCase()}</span>
                        )}
                      </div>
                      <div>{selectedItems && selectedItems.id === item.id && <CheckIcon width={20} height={20} />}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UncontrolledDropdown;
