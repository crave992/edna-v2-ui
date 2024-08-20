import { useState, MouseEvent } from 'react';
import { useClickOutside } from '@mantine/hooks';
import CloseIcon from '@/components/svg/CloseIcon';
import DropdownChevron from '@/components/svg/DropdownChevron';
import LevelDto from '@/dtos/LevelDto';

interface Item {
  name: string;
  level?: LevelDto;
}

interface DropDownMenuProps {
  data: Item[];
  component: string;
  selectedItems: Item | null;
  setSelectedItems: Function;
}

const DropDownMenu = ({ data, component, selectedItems, setSelectedItems }: DropDownMenuProps) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const dropdownRef = useClickOutside(() => setIsOpenDropdown(false));

  const handleClear = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setSelectedItems(null);
  };

  const handleSelectItem = (item: Item) => {
    setSelectedItems(item);
    setIsOpenDropdown(false);
  };

  return (
    <div className="tw-relative" ref={dropdownRef}>
      <button
        type="button"
        className="tw-flex tw-justify-between tw-w-full tw-py-2.5 tw-px-3.5 tw-text-sm tw-text-[#667085] tw-border tw-border-[#D0D5DD] tw-border tw-border-solid tw-rounded-lg tw-bg-white tw-items-center"
        id="menu-button"
        aria-expanded="true"
        aria-haspopup="true"
        onClick={() => setIsOpenDropdown(!isOpenDropdown)}
      >
        <div>
          <span>{selectedItems ? 'timeSchedule' in selectedItems && `${selectedItems.level?.name} - ${selectedItems.name} - ${selectedItems.timeSchedule}` || selectedItems.name : component}</span>
        </div>
        <div className="tw-flex">
          {selectedItems && (
            <div className="tw-cursor-pointer tw-flex tw-items-center" onClick={(event) => handleClear(event)}>
              <CloseIcon />
            </div>
          )}
          {!selectedItems && (
            <span
              className={`tw-transform tw-transition-all tw-duration-300 tw-ease-in-out ${
                isOpenDropdown ? 'tw-rotate-180' : ''
              }`}
            >
              <DropdownChevron />
            </span>
          )}
        </div>
      </button>
      {isOpenDropdown && (
        <div
          className="tw-w-full tw-absolute tw-right-0 tw-z-10 tw-mt-1 tw-w-56 tw-origin-top-right tw-rounded-md tw-bg-white tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-focus:outline-none tw-max-h-[250px] tw-overflow-y-scroll custom-thin-scrollbar"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {data &&
              data.map((item: any, index: number) => {
                return (
                  <div
                    className="tw-text-gray-700 tw-block tw-px-4 tw-py-2 tw-text-sm tw-cursor-pointer"
                    role="menuitem"
                    id={`menu-item-${index}`}
                    key={`menu-item-${index}`}
                    onClick={() => handleSelectItem(item)}
                  >
                    {'timeSchedule' in item && `${item.level.name} - ${item.name} - ${item.timeSchedule}` || item.name}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDownMenu;
