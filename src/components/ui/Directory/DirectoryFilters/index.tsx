import { ChangeEvent, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotesCloseIcon from '@/components/svg/NotesCloseIcon';
import CheckMarkIcon from '@/components/svg/CheckMarkIcon';
import StatusDot from '@/components/svg/StatusDot';
import { useClickOutside } from '@mantine/hooks';
import FilteredItemsDto from '@/dtos/FilteredItemsDto';
import FilterDto from '@/dtos/FilterDto';
import SearchIcon from '@/components/svg/SearchIcon';

interface SectionProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  component: string;
  filters: FilterDto[];
  filteredItems: FilteredItemsDto;
  setFilteredItems: (filteredItems: FilteredItemsDto) => void;
  setShouldApplyFilters: (shouldApply: boolean) => void;
}

export default function DirectoryFilters({
  showModal,
  setShowModal,
  component,
  filters,
  filteredItems,
  setFilteredItems,
  setShouldApplyFilters,
}: SectionProps) {
  const ref = useClickOutside(() => setShowModal(false));
  const [selectedFilters, setSelectedFilters] = useState<FilteredItemsDto>(filteredItems);
  const [classOptions, setClassOptions] = useState<FilterDto[] | []>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [initialFilters, setInitialFilters] = useState<FilteredItemsDto>(filteredItems);

  useEffect(() => {
    if (showModal) {
      setInitialFilters(JSON.parse(JSON.stringify(filteredItems)));
    }
  }, [showModal, filteredItems]);

  const handleAddFilter = (filterName: string, itemName: string) => {
    const updatedFilters = { ...selectedFilters };

    if (!updatedFilters[filterName]) {
      // If the filterName doesn't exist, create it with an array containing itemName
      updatedFilters[filterName] = [itemName];
    } else {
      // If the filterName already exists, check if itemName is in the array
      const index = updatedFilters[filterName].indexOf(itemName);
      if (index === -1) {
        // If itemName is not in the array, add it
        updatedFilters[filterName].push(itemName);
      } else {
        // If itemName is in the array, remove it
        updatedFilters[filterName].splice(index, 1);
      }
    }

    setSelectedFilters(updatedFilters);
  };

  const handleResetFilter = () => {
    setSelectedFilters({
      Compensation: [],
      Level: [],
      Status: [],
    });
  };

  const handleApplyFilters = () => {
    setFilteredItems(selectedFilters);
    setShouldApplyFilters(true);
    setShowModal(false);
  };

  const handleCancel = () => {
    setFilteredItems(initialFilters);
    setShowModal(false);
    setShouldApplyFilters(false);
  };

  useEffect(() => {
   
    const allClassOptions: FilterDto[] = filters.find((filter) => filter.name === 'Class')?.data || [];

    const noClassOption = { name: 'No Class', id: 'no-class' };
    let filteredClasses: FilterDto[] = [noClassOption];

    if (selectedFilters.Level && selectedFilters.Level.length > 0) {
      const levelData = filters.find((filter) => filter.name === 'Level')?.data || [];
      const selectedLevelNames = selectedFilters.Level.map(
        (levelName) => levelData.find((level) => level.name === levelName)?.name
      ).filter((name) => name !== undefined);
      
      if (allClassOptions.length > 0) {
        const classOptionsForSelectedLevels = allClassOptions.filter(
          (cls) => cls.level && selectedLevelNames.includes(cls.level.name)
        );
        filteredClasses = [...filteredClasses, ...classOptionsForSelectedLevels];
      }
    } else {
      if (allClassOptions.length > 0) {
        filteredClasses = [...filteredClasses, ...allClassOptions];
      }
    }

    if (searchTerm) {
      filteredClasses = filteredClasses.filter((cls) => cls.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    filteredClasses = filteredClasses.filter(
      (option, index, self) => index === self.findIndex((t) => t.name === option.name)
    );

    setClassOptions(filteredClasses);
  }, [selectedFilters, filters, searchTerm]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <AnimatePresence>
      {showModal && (
        <>
          {/* Backdrop */}
          <div className="tw-bg-black/[0.3] tw-w-screen tw-h-screen tw-top-0 tw-left-0 tw-fixed tw-z-20" />
          <motion.div
            initial={{ right: -400 }}
            animate={{ right: 0 }}
            exit={{ right: -400 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="tw-fixed tw-z-50 tw-top-0 tw-right-0 tw-h-screen tw-w-[400px] tw-bg-white tw-shadow-xl tw-flex tw-flex-col"
            ref={ref}
          >
            <div className="tw-pt-3xl tw-pl-3xl tw-pr-lg tw-pb-xl tw-border-solid tw-border-b tw-border-secondary tw-border-x-0 tw-border-t-0">
              <div className="tw-justify-between tw-flex">
                <div className="tw-text-xl-semibold">{component} Filters</div>
                <span className="tw-cursor-pointer" onClick={() => setShowModal(false)}>
                  <NotesCloseIcon />
                </span>
              </div>
            </div>
            <div className="tw-flex-1 tw-overflow-y-auto custom-thin-scrollbar tw-space-y-xl tw-p-3xl">
              {filters &&
                filters.map((filter: FilterDto, index: number) => {
                  let data = filter.data;
                  if (filter.name === 'Class') {
                    data = classOptions;
                  }

                  return (
                    <div className="tw-flex tw-flex-col tw-space-y-lg" key={index}>
                      <div className="tw-text-sm-medium tw-text-secondary">{filter.name}</div>
                      {filter.name === 'Class' && (
                        <div className="tw-relative tw-flex tw-items-center tw-h-[44px] tw-my-lg">
                          <div className="tw-absolute tw-inset-y-0 tw-start-0 tw-flex tw-items-center tw-ps-10px tw-pointer-events-none">
                            <SearchIcon />
                          </div>
                          <input
                            type="search"
                            id="default-search"
                            className="tw-placeholder-placeholder tw-text-md-regular tw-text-primary tw-block tw-w-full tw-py-10px tw-px-14px tw-ps-10 tw-space-x-md tw-border tw-border-primary tw-border tw-border-solid tw-rounded-md tw-bg-white"
                            placeholder="Search"
                            onChange={handleSearchChange}
                            value={searchTerm}
                          />
                        </div>
                      )}
                      {data &&
                        data.map((filterItem, index) => {
                          const itemName = filterItem.name || '';
                          const isChecked =
                            selectedFilters[filter.name] && selectedFilters[filter.name].includes(itemName);

                          return (
                            <div
                              className="tw-flex tw-items-center tw-ml-md tw-space-x-md"
                              key={`${filter}-filterItem-${index}`}
                            >
                              {!isChecked ? (
                                <input
                                  id={`checkbox-${index}-${filter.name}`}
                                  type="checkbox"
                                  value=""
                                  className="tw-appearance-none tw-w-[16px] tw-h-[16px] tw-bg-white tw-border tw-border-primary tw-border-solid tw-rounded tw-cursor-pointer"
                                  onClick={() => handleAddFilter(filter.name, itemName)}
                                />
                              ) : (
                                <div
                                  className="tw-w-xl tw-h-xl tw-p-0.5 tw-flex tw-items-center tw-justify-center tw-rounded tw-bg-brand-primary tw-cursor-pointer"
                                  onClick={() => handleAddFilter(filter.name, itemName)}
                                >
                                  <CheckMarkIcon />
                                </div>
                              )}
                              <label
                                className="tw-flex tw-items-center tw-bg-white tw-rounded-md tw-rounded-md tw-border-primary tw-border tw-border-solid tw-px-md tw-py-xxs tw-text-sm-medium tw-text-secondary tw-cursor-pointer"
                                onClick={() => handleAddFilter(filter.name, itemName)}
                              >
                                {filter.name === 'Status' && (
                                  <span className="tw-mr-1">
                                    <StatusDot fill={filterItem.color} />
                                  </span>
                                )}
                                {itemName}
                              </label>
                            </div>
                          );
                        })}
                    </div>
                  );
                })}
            </div>
            <div className="tw-py-xl tw-px-3xl tw-flex tw-items-center tw-justify-between tw-border-solid tw-border-t tw-border-secondary tw-border-x-0 tw-border-b-0">
              <div
                className="tw-text-sm-semibold tw-text-button-tertiary tw-cursor-pointer"
                onClick={() => handleResetFilter()}
              >
                Reset Filter
              </div>
              <div className="tw-flex tw-items-center tw-justify-center tw-space-x-lg">
                <button
                  className="tw-h-[40px] tw-flex tw-items-center tw-justify-center tw-text-sm-semibold tw-rounded-md tw-px-14px tw-py-10px tw-shadow-sm tw-bg-white tw-text-button-secondary tw-border tw-border-button-secondary tw-border-solid"
                  onClick={handleCancel}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="tw-h-[40px] tw-flex tw-items-center tw-justify-center tw-text-sm-semibold tw-rounded-md tw-px-14px tw-py-10px tw-shadow-sm tw-bg-brand-primary tw-text-white tw-border-transparent"
                  onClick={() => handleApplyFilters()}
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
