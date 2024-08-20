import SearchIcon from '@/components/svg/SearchIcon';
import FilterIcon from '@/components/svg/FilterIcon';
import PlusIcon from '@/components/svg/PlusIcon';
import { useEffect, useState } from 'react';
import SkeletonBar from '@/components/common/Skeletons/SkeletonBar';
import FilteredItemsDto from '@/dtos/FilteredItemsDto';
import { useFocusContext } from '@/context/FocusContext';

interface DirectoryHeaderProps {
  title: string;
  subTitle: string;
  setShowFilters: Function;
  setShowAdd: Function;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  type: string;
  isFetching: boolean;
  selectedFilters: FilteredItemsDto;
  showAddButton? : boolean;
  component?:string;
}

const DirectoryHeader = ({
  title,
  subTitle,
  setShowFilters,
  setShowAdd,
  searchTerm,
  setSearchTerm,
  type,
  isFetching,
  selectedFilters,
  showAddButton = true,
  component,
}: DirectoryHeaderProps) => {
  const [value, setValue] = useState<string>(searchTerm);
  const { currentUserRoles } = useFocusContext();
  const shouldShowAddButton = () => {
    if (!currentUserRoles?.isStaff) {
      if (type !== 'Parent' && showAddButton) {
        if (type === 'Staff' && !currentUserRoles?.hasSuperAdminRoles && currentUserRoles?.hasAdminRoles) {
          return false;
        }
        return true;
      }
      return false;
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTerm(value);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [value]);

  const countEntries = (data: FilteredItemsDto): number => {
    let totalEntries = 0;
    Object.values(data).forEach((value) => {
      totalEntries += value.length;
    });
    return totalEntries;
  };

  return (
    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex tw-items-center tw-justify-between tw-py-2xl">
      <div>
        <div className="tw-text-lg-semibold tw-text-primary">{title}</div>
        <div className={`tw-text-sm-regular tw-text-tertiary ${component === "reporting" ? 'tw-invisible' : ''}`}> {/*  Added tw-invisible to hide for now */}
          {isFetching ? <SkeletonBar width="140px" height="15px" /> : subTitle}
        </div>
      </div>

      <div className={`tw-flex tw-items-center tw-space-x-xl ${component === "reporting" ? 'tw-invisible' : ''}`}> {/*  Added tw-invisible to hide for now */}
        <div className="tw-relative tw-flex tw-items-center tw-w-[320px] tw-h-[44px]">
          <div className="tw-absolute tw-inset-y-0 tw-start-0 tw-flex tw-items-center tw-ps-10px tw-pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="search"
            id="default-search"
            className="tw-placeholder-placeholder tw-text-md-regular tw-text-primary tw-block tw-w-full tw-py-10px tw-px-14px tw-ps-10 tw-space-x-md tw-border tw-border-primary tw-border-solid tw-rounded-md tw-bg-white"
            placeholder="Search"
            onChange={(event) => setValue(event.target.value)}
            value={value}
          />
        </div>
        <div>
          <button
            className="tw-h-[42px] tw-text-sm-semibold tw-text-button-secondary tw-flex tw-items-center tw-justify-center tw-space-x-sm tw-py-10px tw-px-14px tw-bg-white tw-rounded-md tw-border tw-border-primary tw-border-solid tw-shadow-sm hover:tw-bg-button-secondary-hover"
            onClick={() => setShowFilters(true)}
            disabled={isFetching}
          >
            <FilterIcon />
            <div>Filter</div>
            {countEntries(selectedFilters) > 0 && (
              <div className="tw-border tw-border-secondary tw-border-solid tw-rounded-full tw-text-xs-medium tw-text-secondary tw-py-xxs tw-px-md tw-min-w-[24px] tw-bg-white">
                {countEntries(selectedFilters)}
              </div>
            )}
          </button>
        </div>
        {shouldShowAddButton() && (
          <div>
            <button
              className={
                'tw-h-[40px] tw-text-sm-semibold tw-text-white tw-flex tw-items-center tw-justify-center tw-py-14px tw-px-10px tw-space-x-sm tw-bg-brand-primary tw-rounded-md tw-border tw-border-brand tw-border-solid tw-shadow-sm hover:tw-bg-button-primary-hover'
              }
              onClick={() => setShowAdd(true)}
              disabled={isFetching}
            >
              <PlusIcon stroke="white" />
              <div>Add {type}</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectoryHeader;
