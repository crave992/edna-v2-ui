import { useState, MouseEvent, ChangeEvent } from 'react';
import { useClickOutside } from '@mantine/hooks';
import CloseIcon from '@/components/svg/CloseIcon';
import DropdownChevron from '@/components/svg/DropdownChevron';
import { Control, UseControllerProps, FieldValues, useFormContext } from 'react-hook-form';
import CustomFormError from '../CustomFormError';
import USAIcon from '@/components/svg/USAIcon';
import PuertoRicoIcon from '@/components/svg/PuertoRicoIcon';
import CanadaIcon from '@/components/svg/CanadaIcon';
import UserIcon from '@/components/svg/UserIcon';
import StatusDot from '@/components/svg/StatusDot';
import Avatar from '@/components/ui/Avatar';
import CheckIcon from '@/components/svg/CheckIcon';
import StudentIcon from '@/components/svg/StudentIcon';

interface Item {
  id: number;
  name: string;
  staffId?: number;
  [key: string]: any;
}

interface CustomDropdownProps<T extends FieldValues> extends UseControllerProps<T> {
  data: Item[];
  component: string;
  selectedItems: { name: string; [key: string]: any } | null;
  options?: { name: string; [key: string]: any }[];
  setSelectedItems: Function;
  control: Control<T>;
  containerClassName?: string;
  withIcon?: boolean;
  placeHolderIcon?: string;
  withStatusDot?: boolean;
  withProfile?: boolean;
  index?: number;
  removeSelection?: boolean;
  disabled?: boolean;
}

const CustomDropdown = <T extends {}>({
  data,
  component,
  selectedItems,
  setSelectedItems,
  control,
  name,
  defaultValue,
  containerClassName,
  withIcon,
  placeHolderIcon,
  withStatusDot,
  withProfile,
  index = undefined,
  options = [],
  removeSelection,
  disabled,
}: CustomDropdownProps<T>) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const dropdownRef = useClickOutside(() => setIsOpenDropdown(false));
  const { setValue, formState, clearErrors, setError } = useFormContext();

  const handleClear = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    let value = 0;
    if (index !== undefined && index >= 0) {
      let optionsCopy = [...options];
      optionsCopy[index] = { id: 0, name: '' };
      setSelectedItems(optionsCopy);
      let filteredOptions = optionsCopy.filter((option) => option.id !== 0);
      if (filteredOptions.length > 0) value = 1;
      setValue(name.toString(), undefined);
    } else {
      setSelectedItems(null);
      setValue(name.toString(), undefined);
    }
  };

  const handleSelectItem = (item: Item) => {
    if (index !== undefined && index >= 0) {
      let optionsCopy = [...options];
      optionsCopy[index] = item;
      setSelectedItems(optionsCopy);
    } else {
      setSelectedItems(item);
    }

    setValue(name.toString(), item.id);
    clearErrors(name);
    setIsOpenDropdown(false);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'UNITED STATES':
        return (
          <div className="tw-mr-2">
            <USAIcon />
          </div>
        );
      case 'PUERTO RICO':
        return (
          <div className="tw-mr-2">
            <PuertoRicoIcon />
          </div>
        );
      case 'CANADA':
        return (
          <div className="tw-mr-2">
            <CanadaIcon />
          </div>
        );
      case 'user':
        return (
          <div className="tw-mr-2">
            <UserIcon />
          </div>
        );
      case 'student':
        return (
          <div className="tw-mr-2">
            <StudentIcon />
          </div>
        );
    }
  };

  const getStatusIcon = (name: string) => {
    switch (name) {
      case 'Present':
        return (
          <div className="tw-mr-2">
            <StatusDot fill="success" />
          </div>
        );
      case 'Tardy':
        return (
          <div className="tw-mr-2">
            <StatusDot fill="warning" />
          </div>
        );
      case 'Absent':
      case 'Unexcused':
      case 'Excused':
        return (
          <div className="tw-mr-2">
            <StatusDot fill="error" />
          </div>
        );
      case 'Released':
        return (
          <div className="tw-mr-2">
            <StatusDot fill="brand" />
          </div>
        );
    }
  };

  return (
    <div className={`tw-flex tw-items-start tw-justify-start tw-flex-col tw-flex-1 tw-relative ${containerClassName}`}>
      <div className="tw-relative tw-w-full" ref={dropdownRef}>
        <button
          disabled={disabled ?? false}
          type="button"
          className="tw-flex tw-text-md-regular tw-justify-between tw-w-full tw-py-10px tw-px-14px tw-border tw-border-primary tw-border-solid tw-rounded-md tw-bg-white tw-items-center"
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
                className={`tw-text-primary ${
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
          {removeSelection === true ? (
            <div className="tw-flex">
              {}
              {selectedItems && selectedItems.name !== '' && (
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
          ) : (
            <div className="tw-flex">
              {}
              <span
                className={`tw-transform tw-transition-all tw-duration-300 tw-ease-in-out ${
                  isOpenDropdown ? 'tw-rotate-180' : ''
                }`}
              >
                <DropdownChevron />
              </span>
            </div>
          )}
        </button>
        {isOpenDropdown && (
          <div
            className="tw-w-full tw-absolute tw-right-0 tw-z-[60] tw-mt-1 tw-origin-top-right tw-rounded-md tw-bg-white tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-focus:outline-none tw-max-h-[250px] tw-overflow-y-scroll custom-thin-scrollbar"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="py-1" role="none">
              {data &&
                data.length > 0 &&
                data.map((item: Item, index: number) => {
                  return (
                    <div
                      className={`tw-text-md-regular tw-text-primary tw-px-14px tw-py-10px tw-cursor-pointer tw-flex tw-items-center tw-justify-start hover:tw-bg-secondary ${
                        withProfile && 'tw-text-md-medium tw-gap-x-md tw-justify-between'
                      } ${selectedItems && selectedItems.id === item.id && 'tw-bg-secondary'}`}
                      role="menuitem"
                      id={`menu-item-${index}`}
                      key={`menu-item-${index}`}
                      onClick={() => handleSelectItem(item)}
                    >
                      <div className={`${withProfile && 'tw-gap-x-md'} tw-flex tw-flex-row`}>
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
                      {selectedItems && selectedItems.id === item.id && (
                        <div className="tw-absolute tw-right-0">
                          <CheckIcon width={20} height={20} />
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
      {formState.errors[name] && formState?.errors[name]?.message && (
        <CustomFormError error={formState?.errors[name]?.message} />
      )}
    </div>
  );
};

export default CustomDropdown;
