import { useState, MouseEvent, ChangeEvent, ReactNode } from 'react';
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

interface CustomAutoCompleteProps<T extends FieldValues> extends UseControllerProps<T> {
  data: Item[];
  component: string;
  selectedItems: { name: string; [key: string]: any } | null;
  options?: { name: string; [key: string]: any }[];
  setSelectedItems: Function;
  control?: Control<T>;
  containerClassName?: string;
  withIcon?: boolean;
  placeHolderIcon?: string;
  withStatusDot?: boolean;
  withProfile?: boolean;
  index?: number;
  selectedGuide?: Item | null;
  iconLeading?: ReactNode;
  iconTrailing?: ReactNode;
  showDropdown?: boolean;
  hasRightText?: boolean;
  rightText?: string | null;
  dropdownClassName?: string;
}

const CustomAutoComplete = <T extends {}>({
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
  selectedGuide,
  iconLeading,
  iconTrailing,
  showDropdown,
  hasRightText,
  rightText,
  dropdownClassName,
}: CustomAutoCompleteProps<T>) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
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
    setSearchText('');
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
    setSearchText('');
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'UNITED STATES':
        return (
          <div className="tw-mr-md">
            <USAIcon />
          </div>
        );
      case 'PUERTO RICO':
        return (
          <div className="tw-mr-md">
            <PuertoRicoIcon />
          </div>
        );
      case 'CANADA':
        return (
          <div className="tw-mr-md">
            <CanadaIcon />
          </div>
        );
      case 'user':
        return (
          <div className="tw-mr-md">
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
          <div className="tw-mr-md">
            <StatusDot fill="success" />
          </div>
        );
      case 'Tardy':
        return (
          <div className="tw-mr-md">
            <StatusDot fill="warning" />
          </div>
        );
      case 'Absent':
        return (
          <div className="tw-mr-md">
            <StatusDot fill="error" />
          </div>
        );
      case 'Released':
        return (
          <div className="tw-mr-md">
            <StatusDot fill="brand" />
          </div>
        );
    }
  };

  return (
    <div className={`tw-flex tw-items-start tw-justify-start tw-flex-col tw-flex-1 tw-relative ${containerClassName}`}>
      <div className="tw-relative tw-w-full" ref={dropdownRef}>
        {selectedItems && selectedItems.name !== '' ? (
          <button
            type="button"
            className="tw-flex tw-space-x-md tw-text-md-regular tw-justify-between tw-w-full tw-py-10px tw-px-14px tw-border tw-border-primary tw-border-solid tw-rounded-md tw-bg-white tw-items-center"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
            onClick={() => setIsOpenDropdown(!isOpenDropdown)}
          >
            {hasRightText ? (
              <div className="tw-flex tw-w-full tw-justify-between">
                <div className="tw-flex tw-items-center tw-justify-start">
                  {iconLeading && (!selectedItems || (selectedItems && selectedItems.name === '')) && (
                    <div className="tw-mr-md">{iconLeading}</div>
                  )}
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
                        <span className="tw-text-md-regular tw-text-tertiary">
                          @{selectedItems.firstName.replace(/\s/g, '').toLowerCase()}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="tw-text-placeholder">{component}</div>
                  )}
                  {iconTrailing && <div className="tw-mr-md">{iconTrailing}</div>}
                </div>
                <div className="tw-text-sm-regular tw-text-tertiary">{rightText}</div>
              </div>
            ) : (
              <div className="tw-flex tw-items-center tw-justify-start">
                {iconLeading && (!selectedItems || (selectedItems && selectedItems.name === '')) && (
                  <div className="tw-mr-md">{iconLeading}</div>
                )}
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
                      <span className="tw-text-md-regular tw-text-tertiary">
                        @{selectedItems.firstName.replace(/\s/g, '').toLowerCase()}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="tw-text-placeholder">{component}</div>
                )}
                {iconTrailing && <div className="tw-mr-md">{iconTrailing}</div>}
              </div>
            )}
            <div className="tw-flex">
              {selectedItems && selectedItems.name !== '' && (
                <div className="tw-cursor-pointer tw-flex tw-items-center" onClick={(event) => handleClear(event)}>
                  <CloseIcon color="primary" width="24" height="24" />
                </div>
              )}
              {!selectedItems ||
                (selectedItems.name === '' && (
                  <span
                    className={`tw-transform tw-transition-all tw-duration-300 tw-ease-in-out ${
                      isOpenDropdown ? 'tw-rotate-180' : ''
                    } ${dropdownClassName}`}
                  >
                    <DropdownChevron />
                  </span>
                ))}
            </div>
          </button>
        ) : (
          <div className="tw-relative tw-flex tw-items-center">
            {iconLeading && (!selectedItems || (selectedItems && selectedItems.name === '')) && (
              <div className="tw-mr-md tw-absolute tw-left-3.5">{iconLeading}</div>
            )}
            <input
              placeholder={component}
              type="text"
              onChange={(e) => setSearchText(e.target.value)}
              className="tw-flex tw-text-md-regular tw-justify-between tw-w-full tw-py-10px tw-px-14px tw-border tw-border-primary tw-border-solid tw-rounded-md tw-bg-white tw-items-center tw-cursor-pointer"
              onFocus={() => setIsOpenDropdown(true)}
            />
            <div className="tw-flex tw-absolute tw-right-3.5">
              {selectedItems && selectedItems.name !== '' && (
                <div className="tw-cursor-pointer tw-flex tw-items-center" onClick={(event) => handleClear(event)}>
                  <CloseIcon color="primary" width="24" height="24" />
                </div>
              )}
              {(!selectedItems || selectedItems.name === '') && showDropdown && (
                <span
                  className={`tw-transform tw-transition-all tw-duration-300 tw-ease-in-out ${
                    isOpenDropdown ? 'tw-rotate-180' : ''
                  }`}
                >
                  <DropdownChevron />
                </span>
              )}
            </div>
          </div>
        )}

        {isOpenDropdown && (
          <div
            className="tw-w-full tw-absolute tw-right-0 tw-z-[60] tw-mt-1 tw-origin-top-right tw-rounded-md tw-bg-white tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-focus:outline-none tw-max-h-[250px] tw-overflow-y-scroll custom-thin-scrollbar"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="py-1" role="none">
              {data &&
                data
                  .filter(
                    (filter) =>
                      filter.name.toLocaleLowerCase().includes(searchText) ||
                      (filter.email && filter.email.toLocaleLowerCase().includes(searchText))
                  )
                  .map((item: Item, index: number) => {
                    return (
                      <div
                        className={`tw-text-md-regular tw-text-primary tw-px-14px tw-py-10px tw-cursor-pointer tw-flex tw-items-center tw-justify-start hover:tw-bg-secondary ${
                          withProfile && 'tw-text-md-medium tw-gap-x-md tw-justify-between'
                        } `}
                        role="menuitem"
                        id={`menu-item-${index}`}
                        key={`menu-item-${index}`}
                        onClick={() => handleSelectItem(item)}
                      >
                        <div className={`${withProfile && 'tw-flex tw-gap-x-md'}`}>
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
                            <span className="tw-text-md-regular tw-text-tertiary">
                              @{item.firstName.replace(/\s/g, '').toLowerCase()}
                            </span>
                          )}
                        </div>
                        {selectedItems && selectedItems.id !== 0 && selectedItems.id === item.id && (
                          <div>
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

export const CustomAutoCompleteNoControls = <T extends {}>({
  data,
  component,
  selectedItems,
  setSelectedItems,
  name,
  containerClassName,
  withIcon,
  withStatusDot,
  withProfile,
  index = undefined,
  options = [],
  iconLeading,
  iconTrailing,
}: CustomAutoCompleteProps<T>) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const dropdownRef = useClickOutside(() => setIsOpenDropdown(false));

  const getIcon = (name: string) => {
    switch (name) {
      case 'UNITED STATES':
        return (
          <USAIcon />
        );
      case 'PUERTO RICO':
        return (
          <PuertoRicoIcon />
        );
      case 'CANADA':
        return (
          <CanadaIcon />
        );
      case 'user':
        return (
          <UserIcon />
        );
      case 'student':
        return (
          <StudentIcon />
        );
    }
  };

  const handleClear = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    let value = 0;
    if (index !== undefined && index >= 0) {
      let optionsCopy = [...options];
      optionsCopy[index] = { id: 0, name: '' };
      setSelectedItems(optionsCopy);
      let filteredOptions = optionsCopy.filter((option) => option.id !== 0);
      if (filteredOptions.length > 0) value = 1;
    } else {
      setSelectedItems(null);
    }
    setSearchText('');
  };

  const handleSelectItem = (item: Item) => {
    if (index !== undefined && index >= 0) {
      let optionsCopy = [...options];
      optionsCopy[index] = item;
      setSelectedItems(optionsCopy);
    } else {
      setSelectedItems(item);
    }

    setIsOpenDropdown(false);
    setSearchText('');
  };

  return (
    <div className={`tw-flex tw-items-start tw-justify-start tw-flex-col tw-flex-1 tw-relative ${containerClassName}`}>
      <div className="tw-relative tw-w-full" ref={dropdownRef}>
        {selectedItems && selectedItems.name !== '' ? (
          <button
            type="button"
            className="tw-flex tw-text-md-regular tw-justify-between tw-w-full tw-py-10px tw-px-14px tw-border tw-border-primary tw-border-solid tw-rounded-md tw-bg-white tw-items-center"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
            onClick={() => setIsOpenDropdown(!isOpenDropdown)}
          >
            <div className="tw-flex tw-items-center tw-justify-start">
              {iconLeading && <div className="tw-mr-md">{iconLeading}</div>}
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
                    <span className="tw-text-md-regular tw-text-tertiary">
                      @{selectedItems.firstName.replace(/\s/g, '').toLowerCase()}
                    </span>
                  )}
                </div>
              ) : (
                <div className="tw-text-placeholder">{component}</div>
              )}
              {iconTrailing && <div className="tw-mr-md">{iconTrailing}</div>}
            </div>
            <div className="tw-flex">
              {selectedItems && selectedItems.name !== '' && (
                <div className="tw-cursor-pointer tw-flex tw-items-center" onClick={(event) => handleClear(event)}>
                  <CloseIcon />
                </div>
              )}
              {!selectedItems ||
                (selectedItems.name === '' && (
                  <span
                    className={`tw-transform tw-transition-all tw-duration-300 tw-ease-in-out tw-cursor-pointer ${
                      isOpenDropdown ? 'tw-rotate-180' : ''
                    }`}
                  >
                    <DropdownChevron />
                  </span>
                ))}
            </div>
          </button>
        ) : (
          <div className={`tw-relative tw-flex tw-items-center ${withIcon ? 'tw-border-primary tw-border tw-border-solid tw-rounded-md tw-py-10px tw-px-14px' : ''}`}>
            {iconLeading && (!selectedItems || (selectedItems && selectedItems.name === '')) && (
              <div className="tw-mr-md tw-absolute tw-left-3.5">{iconLeading}</div>
            )}
            {withIcon && !selectedItems && <div className="">{getIcon(name)}</div>}
            <input
                placeholder={component}
                type="text"
                onChange={(e) => setSearchText(e.target.value)}
                className={`tw-flex tw-text-md-regular tw-justify-between tw-w-full ${withIcon ? 'tw-border-transparent tw-border-0' : 'tw-py-10px tw-px-14px tw-border-primary'} tw-border tw-border-solid tw-rounded-md tw-bg-white tw-items-center tw-cursor-pointer ${
                  iconLeading && 'tw-pl-md'
                }`}
                onFocus={() => setIsOpenDropdown(true)}
              />
            
            <div className="tw-flex tw-absolute tw-right-3.5">
              {selectedItems && selectedItems.name !== '' && (
                <div className="tw-cursor-pointer tw-flex tw-items-center" onClick={(event) => handleClear(event)}>
                  <CloseIcon />
                </div>
              )}
              {(!selectedItems || selectedItems.name === '') && (
                <span
                  className={`tw-transform tw-transition-all tw-duration-300 tw-ease-in-out tw-cursor-pointer ${
                    isOpenDropdown ? 'tw-rotate-180' : ''
                  }`}
                  onClick={() => setIsOpenDropdown(!isOpenDropdown)}
                >
                  <DropdownChevron />
                </span>
              )}
            </div>
          </div>
        )}

        {isOpenDropdown && (
          <div
            className="tw-w-full tw-absolute tw-right-0 tw-z-[60] tw-mt-1 tw-origin-top-right tw-rounded-md tw-bg-white tw-shadow-lg tw-ring-1 tw-ring-black tw-ring-opacity-5 tw-focus:outline-none tw-max-h-[250px] tw-overflow-y-scroll custom-thin-scrollbar"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="py-1" role="none">
              {data &&
                data
                  .filter((filter) => filter.name.toLocaleLowerCase().includes(searchText))
                  .map((item: Item, index: number) => {
                    return (
                      <div
                        className={`tw-text-md-regular tw-text-primary tw-px-14px tw-py-10px tw-cursor-pointer tw-flex tw-items-center tw-justify-start ${
                          withProfile && 'tw-text-md-medium tw-gap-x-md tw-justify-between'
                        } ${selectedItems && selectedItems.id !== 0 && selectedItems.id === item.id && 'tw-bg-active'}`}
                        role="menuitem"
                        id={`menu-item-${index}`}
                        key={`menu-item-${index}`}
                        onClick={() => handleSelectItem(item)}
                      >
                        <div className={`${withProfile && ' tw-flex tw-gap-x-md'}`}>
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
                            <span className="tw-text-md-regular tw-text-tertiary">
                              @{item.firstName.replace(/\s/g, '').toLowerCase()}
                            </span>
                          )}
                        </div>
                        {withProfile && selectedItems && selectedItems.id !== 0 && selectedItems.id === item.id && (
                          <div>
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
    </div>
  );
};

export default CustomAutoComplete;
