import {
  Controller,
  Control,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import CustomFormError from "../CustomFormError";
import Select, { StylesConfig } from "react-select";
import { useEffect, useState } from "react";

interface CustomSelectProps<T extends FieldValues>
  extends UseControllerProps<T> {
  type?: "single" | "multi";
  value?: string;
  placeholder?: string;
  control: Control<T>;
  displayError?: boolean;
  isSearchable?: boolean;
  onChange?: (value: T[keyof T][] | undefined) => void;
  options?: any[];
  valueField: string;
  textField: string;
  isClearable?: boolean;
  childrenKeyName?: string;
  disabled?: boolean;
}

interface SelectOption {
  label: string;
  value: string;
  child: boolean;
}

const CustomSelect = <T extends {}>({
  name,
  type = "single",
  control,
  placeholder,
  displayError = true,
  isSearchable = false,
  isClearable = true,
  onChange,
  options,
  valueField,
  textField,
  childrenKeyName,
  disabled = false,
}: CustomSelectProps<T>) => {
  const [updatedOptions, setUpdatedOptions] = useState<any[] | undefined>(
    options
  );

  const customizeData = () => {
    const processedOptions = processOptions(options);
    setUpdatedOptions(processedOptions);
  };

  const processOptions = (data: any[] | undefined) => {
    if (!data) return [];

    const flattenedOptions: SelectOption[] = [];
    data.forEach((option) => {
      let newItem: SelectOption = {
        label: option[textField],
        value: option[valueField],
        child: false,
      };

      flattenedOptions.push(newItem);

      if (childrenKeyName && option[childrenKeyName]) {
        option[childrenKeyName].forEach((innerOption: any) => {
          let childItem: SelectOption = {
            label: innerOption[textField],
            value: innerOption[valueField],
            child: true,
          };
          flattenedOptions.push(childItem);
        });
      }
    });

    return flattenedOptions;
  };

  const getOptionLabel = (option: any) => {
    if (option.child) {
      return (
        <span style={{ color: "green" }}>&nbsp;&nbsp;&nbsp;{option.label}</span>
      );
    }
    return option.label;
  };

  useEffect(() => {
    customizeData();
  }, [options]);

  if (type === "multi") {
    return (
      <>
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <>
              <Select
                // options={options}
                options={updatedOptions}
                // getOptionValue={(option) => `${option[valueField]}`}
                // getOptionLabel={(option) => `${option[textField]}`}
                getOptionLabel={getOptionLabel}
                instanceId={name}
                onChange={(option) => {
                  //const selectedValues = option.map((x) => x[valueField]);
                  const selectedValues = option.map((x) => x.value);

                  field.onChange(selectedValues);
                  if (onChange) {
                    onChange(selectedValues);
                  }
                }}
                onBlur={field.onBlur}
                // value={options?.filter((x) =>
                //   (field.value as T[keyof T][])?.includes(x[valueField])
                // )}
                value={updatedOptions?.filter((x) =>
                  (field.value as T[keyof T][])?.includes(x.value)
                )}
                name={name}
                ref={field.ref}
                isSearchable={isSearchable}
                placeholder={placeholder}
                isMulti={true}
                isClearable={isClearable}
                styles={!isClearable ? customStyles : customStylesForOption}
                className="react-select-container"
                classNamePrefix="react-select"
              />

              {displayError && <CustomFormError error={error} />}
            </>
          )}
        />
      </>
    );
  } else {
    return (
      <>
        <Controller
          control={control}
          name={name}
          render={({ field, fieldState: { error } }) => (
            <>
              <Select
                options={updatedOptions}
                // getOptionValue={(option) => `${option[valueField]}`}
                // getOptionLabel={(option) => `${option[textField]}`}
                getOptionLabel={getOptionLabel}
                instanceId={name}
                onChange={(option) => {
                  // field.onChange(option?.[valueField]);
                  // if (onChange) {
                  //   onChange([option?.[valueField]]);
                  // }
                  field.onChange(option?.value);
                  if (onChange) {
                    onChange([option?.value]);
                  }
                }}
                onBlur={field.onBlur}
                //value={options?.find((x) => x[valueField] === field.value)}
                value={updatedOptions?.find((x) => x?.value === field.value)}
                name={name}
                ref={field.ref}
                isSearchable={isSearchable}
                placeholder={placeholder}
                isClearable={isClearable}
                styles={customStylesForOption}
                className="react-select-container"
                classNamePrefix="react-select"
                isDisabled={disabled}
              />

              {displayError && <CustomFormError error={error} />}
            </>
          )}
        />
      </>
    );
  }
};

export default CustomSelect;

const customStyles: StylesConfig<true> = {
  control: (provided) => ({
    ...provided,
    borderRadius: 0, // Example: Customize the control style
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    display: "none", // Hide the cross icon
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    fontWeight: state.data && state.data.children ? "bold" : "normal",
    //color: state.data && state.data.children ? "red" : "green",
  }),
};

const customStylesForOption: StylesConfig<true> = {
  option: (provided: any, state: any) => ({
    ...provided,
    fontWeight:
      state.data && state.data.children && state.data.children.length > 0
        ? "bold"
        : "normal",
    //color: state.data && state.data.children ? "red" : "green",
  }),
};
