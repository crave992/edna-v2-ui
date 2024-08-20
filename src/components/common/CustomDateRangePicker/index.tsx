import DatePicker from 'react-datepicker';
import CalendarIcon from '@/components/svg/CalendarIcon';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { useFormContext } from 'react-hook-form';
import CustomFormError from '../NewCustomFormControls/CustomFormError';

interface CustomDateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: (Date | null)[]) => void;
  name: string;
  placeholder?: string;
  padding?: string;
  height?: string;
  width?: string;
  className?: string;
  yearRange?: number;
  useDropdownMode?: boolean;
  dateRange?: boolean;
}

const CustomDateRangePicker = ({
  startDate,
  endDate,
  onChange,
  name,
  placeholder = 'Select Date',
  padding,
  height,
  width,
  className,
  yearRange,
  useDropdownMode,
  dateRange,
}: CustomDateRangePickerProps) => {
  const { formState } = useFormContext();
  const datepickerRef = useRef<any>(null);
  const prevEndDate = useRef<Date | null>(null);

  function handleClickDatepickerIcon() {
    if (datepickerRef.current) datepickerRef?.current?.setOpen(true);
  }

  useEffect(() => {
    if (prevEndDate.current === null) {
      prevEndDate.current = endDate;
      datepickerRef.current?.setOpen(false);
    }
  }, [endDate]);

  useEffect(() => {
    if (prevEndDate.current) prevEndDate.current = null;
  }, [startDate]);

  return (
    <div className={`${className ? className : 'tw-flex tw-flex-col'}`}>
      <div
        className={`${padding ? padding : 'tw-px-10px tw-py-14px'} ${height ? height : 'tw-h-[40px]'} ${
          width ? width : ''
        } tw-flex tw-flex-row tw-items-center tw-justify-center tw-w-full tw-text-placeholder tw-shadow-xs tw-border tw-border-primary tw-border-solid tw-rounded-md tw-gap-x-1}`}
      >
        <div
          className="tw-flex tw-text-sm-semibold tw-text-secondary tw-items-center tw-justify-center tw-space-x-sm tw-cursor-pointer"
          onClick={() => handleClickDatepickerIcon()}
        >
          <CalendarIcon />
          <div>
            {startDate
              ? `${dayjs(startDate).format('MMM D, YYYY')} ${
                  endDate ? `- ${dayjs(endDate).format('MMM D, YYYY')}` : ''
                }`
              : placeholder}
          </div>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={onChange}
            className="tw-hidden"
            wrapperClassName="tw-relative tw-top-[10px]"
            ref={datepickerRef}
            showMonthDropdown
            showYearDropdown
            {...(useDropdownMode && { dropdownMode: 'select' })}
            dateFormatCalendar=" "
            maxDate={new Date()}
            showPopperArrow={false}
            disabledKeyboardNavigation
            yearDropdownItemNumber={yearRange ?? 10}
            popperPlacement="bottom"
            // monthsShown={2}
          />
        </div>
      </div>
      {formState.errors[name] && formState?.errors[name]?.message && (
        <div className="tw-flex tw-text-left">
          <CustomFormError error={formState?.errors[name]?.message} />
        </div>
      )}
    </div>
  );
};

export default CustomDateRangePicker;
