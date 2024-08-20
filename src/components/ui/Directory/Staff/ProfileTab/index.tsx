import StaffDto from '@/dtos/StaffDto';
import dayjs from 'dayjs';
import Avatar from '@/components/common/Avatar';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
import { yupResolver } from '@hookform/resolvers/yup';
import { StaffUpdateBySelfModel } from '@/models/StaffModel';
import { StaffUpdateBySelfValidationSchema, StaffUpdateBySelfValidationSchemaUserStaff } from '@/validation/StaffValidationSchema';
import CustomDropdown from '@/components/common/NewCustomFormControls/CustomDropdown';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { useState, ChangeEvent, useEffect, useMemo } from 'react';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import { updateStaff, updateStaffActivation, updateStaffDeactivation } from '@/services/api/updateStaff';
import SkeletonBar from '@/components/common/Skeletons/SkeletonBar';
import LoadingSpinner from '@/components/svg/LoadingSpinner';
import SaveIcon from '@/components/svg/SaveIcon';
import { useSession } from 'next-auth/react';
import RoleDto from '@/dtos/RoleDto';
import { AdminRoles, SuperAdminRoles } from '@/helpers/Roles';
import CustomButton from '@/components/ui/CustomButton';
import CustomFormError from '@/components/common/NewCustomFormControls/CustomFormError';
import TextSkeleton from '@/components/ui/Directory/TextSkeleton';
import CustomBooleanRadioButton from '@/components/common/NewCustomFormControls/CustomBooleanRadioButton';
import { logout } from '@/components/common/Logout';
import { AlertIcon } from '@/components/ui/AlertIcon';
import { useSalaryTypesQuery } from '@/hooks/queries/useSalaryQuery';
import { useSystemUserRolesQuery } from '@/hooks/queries/useRolesQuery';
import { useJobTitlesQuery } from '@/hooks/queries/useJobsQuery';
import { useRaceQuery } from '@/hooks/queries/useRaceQuery';
import { useStatesQuery } from '@/hooks/queries/useStatesQuery';
import { useEthnicityQuery } from '@/hooks/queries/useEthnicityQuery';
import { useCountriesQuery } from '@/hooks/queries/useCountriesQuery';
import { useFocusContext } from '@/context/FocusContext';
dayjs.extend(advancedFormat);

interface ProfileTabProps {
  staffData: StaffDto;
  isEditing: boolean;
  setIsEditing: Function;
  isLoading: boolean;
  setIsLoading: Function;
  isLoadingStaffData: boolean;
}

const ProfileTab = ({
  staffData,
  isEditing,
  setIsEditing,
  isLoading,
  setIsLoading,
  isLoadingStaffData,
}: ProfileTabProps) => {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const [roles, setRoles] = useState<string[]>([]);
  const [selectedSystemRole, setSelectedSystemRole] = useState<{ id: string; name: string } | null>(null);
  const [selectedJobTitle, setSelectedJobTitle] = useState<{ id: number; name: string } | null>(null);
  const [selectedSalaryType, setSelectedSalaryType] = useState<{ id: number; name: string } | null>(null);
  const [empStartDate, setEmpStartDate] = useState<Date | null>(null);
  const [employmentEndDate, setEmploymentEndDate] = useState<Date | null>(null);
  const [employmentRehireDate, setEmploymentRehireDate] = useState<Date | null>(null);
  const [selectedEthnicity, setSelectedEthnicity] = useState<{ id: number; name: string } | null>(null);
  const [selectedEthnicityCategory, setSelectedEthnicityCategory] = useState<{ id: number; name: string } | null>(null);
  const [selectedState, setSelectedState] = useState<{ id: number; name: string } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{ id: number; name: string } | null>(null);
  const [isActive, setIsActive] = useState<boolean>();
  const [isOwnAccount, setIsOwnAccount] = useState<boolean>(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState<boolean>(false);

  const { currentUserRoles } = useFocusContext();
  const { data: salaryTypes } = useSalaryTypesQuery();
  const { data: userSystemRoles } = useSystemUserRolesQuery();
  const { data: jobTitles } = useJobTitlesQuery();
  const { data: race } = useRaceQuery();
  const { data: states } = useStatesQuery(selectedCountry?.id!);
  const { data: ethnicity } = useEthnicityQuery(selectedEthnicityCategory?.id!);
  const { data: countries } = useCountriesQuery();

  const methods = useForm<StaffUpdateBySelfModel>({
    resolver: yupResolver(
      AdminRoles.some((role) => roles.includes(role))
        ? StaffUpdateBySelfValidationSchema
        : StaffUpdateBySelfValidationSchemaUserStaff
    ),
  });

  useEffect(() => {
    if (session && session.user) {
      if (staffData) {
        var ownAccount = session?.user.staffId == staffData.id;
        setIsOwnAccount(ownAccount);
      }

      const rolesObject = (session.user?.roles || []) as RoleDto[];
      const roles = rolesObject.map((el) => el.name);
      setRoles(roles);
    }
  }, [status, staffData]);

  useEffect(() => {
    if (staffData && isEditing) {
      if (staffData.systemRole) {
        methods.setValue('systemRole', staffData.systemRole);
        setSelectedSystemRole({ id: staffData.systemRole, name: systemRoleName });
      }
      if (staffData.jobTitle) {
        methods.setValue('jobTitleId', staffData.jobTitle.id);
        setSelectedJobTitle(staffData.jobTitle);
      }
      if (staffData.salaryType && !selectedSalaryType) {
        methods.setValue('salaryTypeId', staffData.salaryType.id);
        setSelectedSalaryType(staffData.salaryType);
      }
      if (staffData.employmentStartDate && !empStartDate) {
        methods.setValue('empStartDate', staffData.employmentStartDate);
        const startDate = new Date(staffData.employmentStartDate);
        startDate.setDate(startDate.getDate() + 1);
        setEmpStartDate(startDate);
      }
      if (staffData.employmentEndDate && !employmentEndDate) {
        methods.setValue('employmentEndDate', staffData.employmentEndDate);
        setEmploymentEndDate(new Date(staffData.employmentEndDate));
      }
      if (staffData.employmentRehireDate && !employmentRehireDate) {
        methods.setValue('employmentRehireDate', staffData.employmentRehireDate);
        setEmploymentRehireDate(new Date(staffData.employmentRehireDate));
      }
      if (staffData.country && !selectedCountry) {
        methods.setValue('countryId', staffData.country.id);
        setSelectedCountry(staffData.country);
      }
      if (staffData.state && !selectedState) {
        methods.setValue('stateId', staffData.state.id);
        setSelectedState(staffData.state);
      }
      if (staffData.addressLine1) methods.setValue('addressLine1', staffData.addressLine1);
      if (staffData.addressLine2) methods.setValue('addressLine2', staffData.addressLine2);
      if (staffData.zipcode) methods.setValue('zipcode', staffData.zipcode);
      if (staffData.nickName) methods.setValue('nickName', staffData.nickName);
      if (staffData.firstName) methods.setValue('firstName', staffData.firstName);
      if (staffData.lastName) methods.setValue('lastName', staffData.lastName);
      if (staffData.email) methods.setValue('email', staffData.email);
      if (staffData.deleteReason) methods.setValue('deleteReason', staffData.deleteReason);
      if (staffData.description) methods.setValue('description', staffData.description);
      if (staffData.homePhoneNumber) methods.setValue('homePhoneNumber', staffData.homePhoneNumber);
      else methods.setValue('homePhoneNumber', null);
      if (staffData.personalEmail) methods.setValue('personalEmail', staffData.personalEmail);
      else methods.setValue('personalEmail', null);

      if (staffData.phoneNumber) methods.setValue('phoneNumber', staffData.phoneNumber);

      if (staffData.salaryAmount) methods.setValue('salaryAmount', staffData.salaryAmount);
      if (staffData.city) methods.setValue('city', staffData.city);
      methods.setValue('title', '.');
      methods.setValue('profileImage', null);

      if (staffData.ethnicityCategory != null) {
        setSelectedEthnicityCategory(staffData.ethnicityCategory);
        methods.setValue('ethnicityCategoryId', staffData.ethnicityCategory.id);
      }

      if (staffData.ethnicity != null) {
        methods.setValue('ethnicityId', staffData.ethnicity.id);
        setSelectedEthnicity(staffData.ethnicity);
      }
      if (typeof staffData.isActive == 'boolean') {
        methods.setValue('isActive', staffData.isActive);
        setIsActive(staffData.isActive);
      }
    } else {
      methods.reset();
    }
  }, [staffData, isEditing]);

  useEffect(() => {
    if (!isEditing) resetData();
  }, [isEditing]);

  const resetData = () => {
    methods.reset();
    setSelectedSystemRole(null);
    setSelectedJobTitle(null);
    setSelectedSalaryType(null);
    setEmpStartDate(null);
    setEmploymentEndDate(null);
    setEmploymentRehireDate(null);
    setSelectedEthnicity(null);
    setSelectedEthnicityCategory(null);
    setSelectedState(null);
    setSelectedCountry(null);
  };

  const systemRoleName = useMemo(() => {
    var rolesName = '';
    if (userSystemRoles) {
      var sysRole = userSystemRoles.find((r: { id: string; name: string }) => r.id === staffData?.systemRole);
      if (sysRole) {
        rolesName = sysRole.name;
      }
    }
    return rolesName;
  }, [staffData, userSystemRoles]);

  const handleSave = async (data: StaffUpdateBySelfModel) => {
    setIsLoading(true);
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof StaffUpdateBySelfModel];
      if (key === 'profileImage') {
        let field = data?.[key] && data?.[key]![0] ? data?.[key]![0] : null;
        formData.append(key, field as File);
      } else {
        formData.append(key, value !== null ? (value as string) : '');
      }
    });
    // new Response(formData).text().then(console.log);

    const response = await updateStaff(formData, staffData.id)
      .then(async (res) => {
        if (res?.ok) {
          let requestData = {
            ...(!isActive && data?.employmentEndDate && { employmentEndDate: new Date(data.employmentEndDate) }),
            ...(!isActive && !data?.employmentEndDate && { employmentEndDate: new Date() }),
            ...(!isActive && { deleteReason: data.deleteReason ? data.deleteReason : ' ' }),
            ...(isActive && data?.empStartDate && { employmentStartDate: new Date(data?.empStartDate) }),
            ...(isActive && { reason: ' ' }),
          };
          if (staffData.employmentEndDate === null && data.employmentEndDate) {
            requestData = {
              employmentEndDate: new Date(data.employmentEndDate),
              deleteReason: data.deleteReason ? data.deleteReason : ' ',
            };
          }
          if (isActive && staffData.isActive !== isActive) await updateStaffActivation(requestData, staffData.id);
          else if (
            (!isActive && staffData.isActive !== isActive) ||
            (staffData.employmentEndDate === null && data.employmentEndDate)
          )
            await updateStaffDeactivation(requestData, staffData.id);
        }
      })
      .finally(() => {
        if (isOwnAccount && formData.get('email') != staffData.email) {
          setIsEditing(false);
          setIsLoading(false);
          setShowLogoutAlert(true);
          setTimeout(() => {
            logout();
          }, 5000);
        } else {
          queryClient.invalidateQueries(['staffs']);
          queryClient.invalidateQueries(['staffs-directory']);
          setIsEditing(false);
          resetData();
          setIsLoading(false);
        }
      });
  };

  const handlePickDate = (date: Date | null, name: string) => {
    if (name === 'empStartDate') {
      setEmpStartDate(date);
      methods.setValue('empStartDate', date);
    } else if (name === 'employmentEndDate') {
      setEmploymentEndDate(date);
      methods.setValue('employmentEndDate', date);
    } else {
      setEmploymentRehireDate(date);
      methods.setValue('employmentRehireDate', date);
    }
  };

  return (
    <>
      <FormProvider {...methods}>
        <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(handleSave)} id="update-staff">
          <div>
            <div className="tw-grid tw-mb-[40px]">
              {!isEditing && (
                <>
                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-border-0 tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center tw-justify-start">
                        Position
                      </div>
                      <div className="tw-py-2xl tw-gap-x-2 tw-flex tw-items-center tw-justify-start tw-relative tw-text-md-normal">
                        {isLoadingStaffData ? (
                          <SkeletonBar />
                        ) : (
                          <>
                            <span>{staffData?.jobTitle?.name ? staffData?.jobTitle?.name : ''}</span>
                            {systemRoleName && (
                              <span className="tw-py-0.5 tw-px-2.5 tw-rounded-md tw-border tw-border-primary tw-border-solid tw-text-sm-medium">
                                {systemRoleName}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {(SuperAdminRoles.some((role: string) => roles.includes(role)) || (staffData?.id == currentUserRoles?.staffId))&& (
                    <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                      <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                        <div className="tw-w-[312px] tw-py-2xl tw-border-0 tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center tw-justify-start">
                          Compensation
                        </div>
                        <div className="tw-py-2xl tw-text-md-normal tw-gap-x-2 tw-flex tw-items-center tw-justify-start">
                          {isLoadingStaffData ? (
                            <SkeletonBar />
                          ) : (
                            <>
                              <span>
                                {staffData?.salaryAmount.toLocaleString(undefined, {
                                  style: 'currency',
                                  currency: 'USD',
                                  minimumFractionDigits: 2,
                                })}
                              </span>
                              {staffData?.salaryType.name && (
                                <span className="tw-py-0.5 tw-px-2.5 tw-rounded-md tw-border tw-border-primary tw-border-solid tw-text-sm-medium">
                                  {staffData?.salaryType.name}
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div
                    className={`t-w-full ${
                      staffData?.employmentEndDate ? '' : 'tw-border-0 tw-border-b tw-border-secondary tw-border-solid'
                    }`}
                  >
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-border-0 tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center tw-justify-start">
                        Start Date
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal">
                        {isLoadingStaffData ? (
                          <SkeletonBar />
                        ) : (
                          dayjs(staffData?.employmentStartDate).add(1, 'day').format('MMMM Do, YYYY')
                        )}
                      </div>
                    </div>
                  </div>

                  {staffData?.employmentEndDate && (
                    <>
                      <div className="t-w-full">
                        <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                          <div className="tw-w-[312px] tw-py-2xl tw-border-0 tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center tw-justify-start">
                            Termination Date
                          </div>
                          <div className="tw-py-2xl tw-text-md-normal">
                            {isLoadingStaffData ? (
                              <SkeletonBar />
                            ) : (
                              dayjs(staffData?.employmentEndDate).format('MMMM Do, YYYY')
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                        <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                          <div className="tw-w-[312px] tw-py-2xl tw-border-0 tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center tw-justify-start">
                            Reason for Termination
                          </div>
                          <div className="tw-py-2xl tw-text-md-normal tw-max-w-[512px]">
                            {isLoadingStaffData ? <SkeletonBar /> : <>{staffData?.deleteReason}</>}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {staffData?.employmentRehireDate && (
                    <div
                      className={`t-w-full ${
                        staffData?.employmentRehireDate
                          ? ''
                          : 'tw-border-0 tw-border-b tw-border-secondary tw-border-solid'
                      }`}
                    >
                      <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                        <div className="tw-w-[312px] tw-py-2xl tw-border-0 tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center tw-justify-start">
                          Rehire Date
                        </div>
                        <div className="tw-py-2xl tw-text-md-normal">
                          {isLoadingStaffData ? (
                            <SkeletonBar />
                          ) : (
                            dayjs(staffData?.employmentRehireDate).format('MMMM Do, YYYY')
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-border-0 tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center tw-justify-start">
                        Description
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-max-w-[512px]">
                        {isLoadingStaffData ? <SkeletonBar /> : <>{staffData?.description}</>}
                      </div>
                    </div>
                  </div>

                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-border-0 tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center tw-justify-start">
                        Work Email Address
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-max-w-[512px]">
                        {isLoadingStaffData ? (
                          <SkeletonBar />
                        ) : (
                          <a
                            className="tw-text-md-normal hover:tw-text-primary tw-text-primary"
                            href={`mailto:${staffData?.email}`}
                          >
                            {staffData?.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-border-0 tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center tw-justify-start">
                        Personal Email Address
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-max-w-[512px]">
                        {isLoadingStaffData ? (
                          <SkeletonBar />
                        ) : (
                          <a
                            className="tw-text-md-normal hover:tw-text-primary tw-text-primary"
                            href={`mailto:${staffData?.personalEmail}`}
                          >
                            {staffData?.personalEmail}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-border-0 tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center tw-justify-start">
                        Cell Phone Number
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-max-w-[512px]">
                        {isLoadingStaffData ? (
                          <SkeletonBar />
                        ) : (
                          <a
                            className="tw-text-md-normal hover:tw-text-primary tw-text-primary"
                            href={`tel:${staffData?.phoneNumber}`}
                          >
                            {staffData?.phoneNumber}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-border-0 tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center tw-justify-start">
                        Home Phone
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-max-w-[512px]">
                        {isLoadingStaffData ? (
                          <SkeletonBar />
                        ) : (
                          <a
                            className="tw-text-md-normal hover:tw-text-primary tw-text-primary"
                            href={`tel:${staffData?.homePhoneNumber}`}
                          >
                            {staffData?.homePhoneNumber}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-border-0 tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center tw-justify-start">
                        Demographics
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-max-w-[512px]">
                        {isLoadingStaffData ? (
                          <SkeletonBar />
                        ) : (
                          <>
                            {staffData?.ethnicityCategory?.name} {staffData?.ethnicity?.name} 
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {(SuperAdminRoles.some((role: string) => roles.includes(role)) || (staffData?.id == currentUserRoles?.staffId)) && (
                    <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                      <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                        <div className="tw-w-[312px] tw-py-2xl tw-border-0 tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center tw-justify-start">
                          SSN
                        </div>
                        <div className="tw-py-2xl tw-text-md-normal censor">
                          {isLoadingStaffData ? <SkeletonBar /> : <>{staffData?.ssn}</>}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-border-0 tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center tw-justify-start">
                        Address
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-max-w-[512px]">
                        {isLoadingStaffData ? (
                          <SkeletonBar />
                        ) : (
                          staffData?.addressLine1 && (
                            <>
                              {staffData?.addressLine1} {staffData?.addressLine2} {staffData?.city},{' '}
                              {staffData?.state?.code} {staffData?.zipcode}
                            </>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="t-w-full tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-py-2xl tw-pr-4xl tw-w-[312px]">
                        <div className="tw-text-sm-semibold tw-text-secondary ">Identification Photo</div>
                        <div className="tw-text-sm-regular tw-text-tertiary">
                          This will be used to for campus security and pickup / drop-off verification.
                        </div>
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-flex tw-items-center tw-justify-start">
                        {isLoadingStaffData ? (
                          <SkeletonBar />
                        ) : (
                          <Avatar imageSrc={staffData?.profilePicture} size={64} name="croppedImage" edit={false} />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full tw-pb-2xl">
                    <div className="tw-min-w-[1016px] tw-mx-4xl tw-flex ">
                      <div className="tw-w-[312px] tw-py-2xl tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center">
                        Active Profile
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-w-[512px] tw-max-w-[512px]">
                        <div className="tw-w-full">
                          {isLoading ? (
                            <TextSkeleton width={30} />
                          ) : (
                            <div>{!staffData ? '' : staffData?.isActive === true ? 'Yes' : 'No'}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {isEditing && (
                <>
                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center">
                        Name
                      </div>
                      <div className="tw-py-2xl tw-gap-x-6 tw-flex tw-items-center tw-justify-start tw-w-[512px] tw-max-w-[512px]">
                        <CustomInput
                          control={methods.control}
                          type="text"
                          name="firstName"
                          placeholder="First"
                          defaultValue={staffData?.firstName || ''}
                          containerClassName="tw-flex-1"
                        />
                        <CustomInput
                          control={methods.control}
                          type="text"
                          name="lastName"
                          placeholder="Last"
                          defaultValue={staffData?.lastName || ''}
                          containerClassName="tw-flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-pr-4xl">
                        <div className="tw-text-sm-semibold tw-text-secondary">Nickname</div>
                        <div className="tw-text-sm-regular tw-text-tertiary">
                          This will be the visible name in attendance, focus modes, etc.
                        </div>
                      </div>
                      <div className="tw-py-2xl tw-gap-x-6 tw-flex tw-items-center tw-justify-start tw-w-[512px] tw-max-w-[512px]">
                        <CustomInput
                          control={methods.control}
                          type="text"
                          name="nickName"
                          placeholder="Nickname"
                          containerClassName="tw-w-full"
                          defaultValue={staffData?.nickName ?? ''}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center">
                        Position
                      </div>
                      <div className="tw-py-2xl tw-gap-x-6 tw-flex tw-items-center tw-justify-start tw-w-[512px] tw-max-w-[512px]">
                        <CustomDropdown
                          selectedItems={selectedSystemRole}
                          setSelectedItems={setSelectedSystemRole}
                          data={userSystemRoles}
                          component="Role"
                          control={methods.control}
                          name="systemRole"
                        />
                        <CustomDropdown
                          selectedItems={selectedJobTitle}
                          setSelectedItems={setSelectedJobTitle}
                          data={jobTitles}
                          component="Job Title"
                          control={methods.control}
                          name="jobTitleId"
                        />
                      </div>
                    </div>
                  </div>

                  {AdminRoles.some((role: string) => roles.includes(role)) && (
                    <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                      <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                        <div className="tw-w-[312px] tw-py-2xl tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center">
                          Compensation
                        </div>
                        <div className="tw-py-2xl tw-text-md-normal tw-gap-x-6 tw-flex tw-items-center tw-justify-start tw-w-[512px] tw-max-w-[512px]">
                          <CustomInput
                            control={methods.control}
                            type="text"
                            name="salaryAmount"
                            placeholder="Amount"
                            containerClassName="tw-flex-1"
                            defaultValue={staffData?.salaryAmount ?? ''}
                          />
                          <CustomDropdown
                            selectedItems={selectedSalaryType}
                            setSelectedItems={setSelectedSalaryType}
                            data={salaryTypes}
                            component="Type"
                            control={methods.control}
                            name="salaryTypeId"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center">
                        Start Date
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-w-[512px] tw-max-w-[512px]">
                        <CustomDatePicker
                          selected={empStartDate}
                          onChange={(date: Date | null) => handlePickDate(date, 'empStartDate')}
                          name="empStartDate"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center">
                        Termination Date
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-w-[512px] tw-max-w-[512px]">
                        <CustomDatePicker
                          name="employmentEndDate"
                          selected={employmentEndDate}
                          onChange={(date: Date | null) => handlePickDate(date, 'employmentEndDate')}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center">
                        Reason for Termination
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-w-[512px] tw-max-w-[512px]">
                        <Controller
                          name="deleteReason"
                          control={methods.control}
                          render={({ field, fieldState: { error } }) => (
                            <>
                              <textarea
                                {...field}
                                rows={4}
                                className={`${
                                  error ? 'tw-border-red-500' : 'tw-border-primary'
                                } tw-h-[154px] tw-block tw-py-3 tw-px-3.5 tw-w-full tw-text-primary tw-bg-white-50 tw-rounded-md tw-border tw-border-primary tw-resize-none tw-text-md-normal`}
                                placeholder="Write a brief reason for termination here."
                              />
                              {error && <CustomFormError error={error.message} />}
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  {staffData?.employmentRehireDate && (
                    <div className="t-w-full">
                      <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                        <div className="tw-w-[312px] tw-py-2xl tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center">
                          Rehire Date
                        </div>
                        <div className="tw-py-2xl tw-text-md-normal tw-w-[512px] tw-max-w-[512px]">
                          <CustomDatePicker
                            name="employmentRehireDate"
                            selected={employmentRehireDate}
                            onChange={(date: Date | null) => handlePickDate(date, 'employmentRehireDate')}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-pr-4xl tw-text-sm-semibold tw-flex tw-items-center">
                        Description
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-w-[512px] tw-max-w-[512px]">
                        <Controller
                          name="description"
                          control={methods.control}
                          render={({ field, fieldState: { error } }) => (
                            <textarea
                              {...field}
                              rows={4}
                              className="tw-h-[154px] tw-block tw-py-3 tw-px-3.5 tw-w-full tw-text-primary tw-bg-white-50 tw-rounded-md tw-border tw-border-primary tw-resize-none tw-text-md-normal"
                              placeholder="Write a brief description of this staff member. Why they joined, what they did for work, and what they want to get out of the role."
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center">
                        Work Email Address
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-w-[512px] tw-max-w-[512px]">
                        <CustomInput
                          control={methods.control}
                          type="email"
                          name="email"
                          placeholder="info@myedna.net"
                          containerClassName="tw-flex-1"
                          defaultValue={staffData?.email ?? ''}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center">
                        Personal Email Address
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-w-[512px] tw-max-w-[512px]">
                        <CustomInput
                          control={methods.control}
                          type="email"
                          name="personalEmail"
                          placeholder="info@myedna.net"
                          containerClassName="tw-flex-1"
                          defaultValue={staffData?.personalEmail ?? ''}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center">
                        Cell Phone Number
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-w-[512px] tw-max-w-[512px]">
                        <CustomInput
                          control={methods.control}
                          type="phone"
                          name="phoneNumber"
                          placeholder="XXX-XXX-XXXX"
                          containerClassName="tw-flex-1"
                          defaultValue={staffData?.phoneNumber ?? ''}
                          icon="phone"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center">
                        Home Phone
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-w-[512px] tw-max-w-[512px]">
                        <CustomInput
                          control={methods.control}
                          type="phone"
                          name="homePhoneNumber"
                          placeholder="XXX-XXX-XXXX"
                          containerClassName="tw-flex-1"
                          defaultValue={staffData?.homePhoneNumber ?? ''}
                          icon="phoneCall"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center">
                        Demographics
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-gap-x-6 tw-flex tw-items-center tw-justify-start tw-w-[512px] tw-max-w-[512px]">
                        <CustomDropdown
                          selectedItems={selectedEthnicityCategory}
                          setSelectedItems={setSelectedEthnicityCategory}
                          data={race}
                          component="Race"
                          control={methods.control}
                          name="ethnicityCategoryId"
                        />
                        <CustomDropdown
                          selectedItems={selectedEthnicity}
                          setSelectedItems={setSelectedEthnicity}
                          data={ethnicity}
                          component="Ethnicity"
                          control={methods.control}
                          name="ethnicityId"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center">
                        SSN
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-flex tw-items-center tw-justify-start tw-w-[512px] tw-max-w-[512px]">
                        <CustomInput
                          control={methods.control}
                          type="text"
                          name="ssn"
                          placeholder="SSN"
                          containerClassName="tw-w-full tw-mb-xl"
                          defaultValue={staffData?.ssn ?? ''}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="tw-border-0 tw-border-b tw-border-secondary tw-border-solid t-w-full">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center">
                        Address
                      </div>
                      <div className="tw-py-xl tw-space-y-sm tw-w-[512px] tw-max-w-[512px]">
                        <div className="tw-flex tw-space-x-3xl">
                          <div className="tw-w-full tw-p-0 tw-space-y-xl">
                            <div className="tw-flex tw-p-0 tw-space-x-3xl">
                              <CustomDropdown
                                selectedItems={selectedCountry}
                                setSelectedItems={setSelectedCountry}
                                data={countries}
                                component="Country"
                                control={methods.control}
                                containerClassName="tw-w-1/2"
                                name="countryId"
                                withIcon={true}
                              />
                              <CustomDropdown
                                selectedItems={selectedState}
                                setSelectedItems={setSelectedState}
                                data={states}
                                component="State"
                                control={methods.control}
                                containerClassName="tw-w-1/2"
                                name="stateId"
                              />
                            </div>
                            <div className="tw-flex tw-p-0 tw-space-x-3xl">
                              <CustomInput
                                control={methods.control}
                                type="text"
                                name="addressLine1"
                                placeholder="Address Line 1"
                                containerClassName="tw-w-1/2"
                                defaultValue={staffData?.addressLine1 ?? ''}
                              />
                              <CustomInput
                                control={methods.control}
                                type="text"
                                name="addressLine2"
                                placeholder="Address Line 2"
                                containerClassName="tw-w-1/2"
                                defaultValue={staffData?.addressLine2 ?? ''}
                              />
                            </div>
                            <div className="tw-flex tw-p-0 tw-space-x-3xl">
                              <CustomInput
                                control={methods.control}
                                type="text"
                                name="city"
                                placeholder="City"
                                containerClassName="tw-w-1/2"
                                defaultValue={staffData?.city ?? ''}
                              />
                              <CustomInput
                                control={methods.control}
                                type="text"
                                name="zipcode"
                                placeholder="Zipcode"
                                containerClassName="tw-w-1/2"
                                defaultValue={staffData?.zipcode ?? ''}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="t-w-full tw-border-0 tw-border-b tw-border-secondary tw-border-solid">
                    <div className="tw-min-w-[1016px] tw-mx-4xl  tw-flex">
                      <div className="tw-w-[312px] tw-py-2xl tw-text-md-normal tw-pr-4xl">
                        <div className="tw-text-sm-semibold tw-text-secondary ">Identification Photo</div>
                        <div className="tw-text-sm-regular tw-text-tertiary">
                          This will be used to for campus security and pickup / drop-off verification.
                        </div>
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-flex tw-items-start tw-justify-start tw-w-[512px] tw-max-w-[512px] tw-gap-x-2.5">
                        <Avatar imageSrc={staffData?.profilePicture} size={64} name="croppedImage" edit={false} />
                        <CustomInput
                          control={methods.control}
                          id={staffData?.id}
                          component="Staff"
                          label="profile image"
                          type="file"
                          name="profileImage"
                          isProfile={true}
                          containerClassName={'tw-flex-1'}
                          // defaultValue={staffData?.profilePicture ?? ''}
                          icon={'cloud'}
                          onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                            const files = e.target.files;

                            if (files) {
                              methods.setValue('profileImage', files);
                            } else {
                              // Handle the case when files are null (optional)
                              console.error('No files selected');
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className="tw-min-w-[1016px] tw-mx-4xl tw-flex ">
                      <div className="tw-w-[312px] tw-py-2xl tw-pr-4xl tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center">
                        Active Profile
                      </div>
                      <div className="tw-py-2xl tw-text-md-normal tw-w-[512px] tw-max-w-[512px]">
                        <div className="tw-w-full">
                          {isLoading ? (
                            <TextSkeleton width={30} />
                          ) : isEditing ? (
                            <div className="tw-flex tw-w-full tw-space-x-2xl">
                              <div className="tw-w-full">
                                <CustomBooleanRadioButton
                                  name="isActive"
                                  control={methods.control}
                                  defaultValue={staffData.isActive}
                                  onChange={(value: boolean) => {
                                    if (value) setIsActive(true);
                                    else setIsActive(false);
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div>{!staffData ? '' : staffData?.isActive === true ? 'Yes' : 'No'}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            {isEditing && (
              <div className="tw-w-full tw-py-xl tw-flex tw-items-center tw-justify-end tw-border tw-border-b-0 tw-border-x-0 tw-border-solid tw-border-secondary">
                <div className="tw-flex tw-min-w-[1016px] tw-mx-4xl  tw-items-center tw-justify-end tw-space-x-lg">
                  <CustomButton
                    text="Cancel"
                    btnSize="md"
                    heirarchy="secondary-color"
                    onClick={() => setIsEditing(false)}
                    className="!tw-w-auto"
                  />
                  <CustomButton
                    text="Save"
                    btnSize="md"
                    heirarchy="primary"
                    type="submit"
                    form="update-staff"
                    className="!tw-w-auto"
                    iconLeading={isLoading ? <LoadingSpinner width={25} /> : <SaveIcon stroke="white" />}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}
          </div>
        </form>
      </FormProvider>
      {showLogoutAlert && (
        <>
          <div className="tw-overlay tw-fixed tw-top-0 tw-left-0 tw-w-full tw-h-screen tw-bg-black tw-bg-opacity-70 tw-z-50"></div>
          <div className="tw-popup tw-fixed tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2 tw-bg-white p-4 tw-rounded tw-z-50">
            <div className="tw-flex tw-flex-row tw-space-x-5xl">
              <div>
                <AlertIcon type="info" />
              </div>
              <div>{`Your account details have been updated. For security, you'll be logged out. Please log in again.`}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProfileTab;
