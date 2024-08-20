import dayjs from 'dayjs';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomDropdown from '@/components/common/NewCustomFormControls/CustomDropdown';
import { useQueryClient } from '@tanstack/react-query';
import { useForm, FormProvider } from 'react-hook-form';
import { useState, useEffect, ReactNode, ChangeEvent } from 'react';
import Avatar from '@/components/ui/Avatar';
import TextSkeleton from '@/components/ui/Directory/TextSkeleton';
import StateDto from '@/dtos/StateDto';
import { ParentDto } from '@/dtos/ParentDto';
import { ParentUpdateModel } from '@/models/ParentModel';
import { updateParent, updateParentStatus } from '@/services/api/updateParent';
import { ParentUpdateValidationSchema } from '@/validation/ParentValidationSchema';
import LoadingSpinner from '@/components/svg/LoadingSpinner';
import SaveIcon from '@/components/svg/SaveIcon';
import CustomBooleanRadioButton from '@/components/common/NewCustomFormControls/CustomBooleanRadioButton';
import { useSession } from 'next-auth/react';
import { logout } from '@/components/common/Logout';
import { AlertIcon } from '@/components/ui/AlertIcon';
import { useCountriesQuery } from '@/hooks/queries/useCountriesQuery';
import { useStatesQuery } from '@/hooks/queries/useStatesQuery';
import { checkPhoneNumber } from '@/utils/partialDetectPhoneNumber';

dayjs.extend(advancedFormat);

interface ParentProfileTabProps {
  data: ParentDto;
  isEditing: boolean;
  setIsEditing: Function;
  isLoading: boolean;
  setIsLoading: Function;
  isLoadingData: boolean;
  formId: string;
}

type FormFields = Pick<
  ParentUpdateModel,
  | 'parentId'
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'workEmail'
  | 'cellPhone'
  | 'homePhone'
  | 'countryId'
  | 'stateId'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'zipcode'
  | 'profession'
  | 'jobTitle'
  | 'employer'
  | 'isActive'
>;

type RowType = {
  label: string;
  subLabel?: string;
  children?: ReactNode;
  isLast?: boolean;
};

const ParentProfileTab = ({
  data,
  isEditing,
  setIsEditing,
  isLoading,
  setIsLoading,
  isLoadingData,
  formId,
}: ParentProfileTabProps) => {
  const [selectedState, setSelectedState] = useState<{ id: number; name: string } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{ id: number; name: string } | null>(null);
  const [isActive, setIsActive] = useState<boolean>();
  const [isOwnAccount, setIsOwnAccount] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const [showLogoutAlert, setShowLogoutAlert] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { data: countries } = useCountriesQuery();
  const { data: states } = useStatesQuery(data?.countryId ?? selectedCountry?.id!);

  const methods = useForm<ParentUpdateModel>({
    resolver: yupResolver(ParentUpdateValidationSchema),
  });

  useEffect(() => {
    if (data && isEditing) {
      const setValueIfPresent = (fieldName: keyof FormFields, value: any): void => {
        if (value) methods.setValue(fieldName, value);
      };
      setValueIfPresent('parentId', data.id);
      setValueIfPresent('firstName', data.firstName);
      setValueIfPresent('lastName', data.lastName);
      setValueIfPresent('email', data.email);
      setValueIfPresent('workEmail', data.workEmail);
      setValueIfPresent('cellPhone', data.cellPhone);
      setValueIfPresent('homePhone', data.homePhone);
      setValueIfPresent('addressLine1', data.addressLine1);
      setValueIfPresent('addressLine2', data.addressLine2);
      setValueIfPresent('city', data.city);
      setValueIfPresent('zipcode', data.zipcode);
      setValueIfPresent('profession', data.profession);
      setValueIfPresent('jobTitle', data.jobTitle);
      setValueIfPresent('employer', data.employer);

      if (data.countryId) {
        methods.setValue('countryId', data.countryId || selectedCountry?.id!);
        setSelectedCountry(data.country ? { id: data.countryId, name: data.country.name } : null);
      }
      if (data.stateId) {
        methods.setValue('stateId', data.stateId || selectedState?.id!);
        setSelectedState(data.state ? { id: data.stateId, name: data.state.name } : null);
      }
      if (typeof data.isActive == 'boolean') {
        methods.setValue('isActive', data.isActive);
        setIsActive(data.isActive);
      }

      setIsOwnAccount(session?.user.email == data.email);
    }
  }, [data, isEditing]);

  const handleSave = async (values: ParentUpdateModel) => {
    setIsLoading(true);
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      const value = values[key as keyof ParentUpdateModel];
      if (key === 'profileImage') {
        let field = values?.[key] && values?.[key]![0] ? values?.[key]![0] : null;
        formData.append(key, field as File);
      } else {
        formData.append(key, value as string);
      }
    });
    // new Response(formData).text().then(console.log);

    updateParent(formData).then(async () => {
      if (isOwnAccount && formData.get('email') != data.email) {
        setIsEditing(false);
        setIsLoading(false);
        setShowLogoutAlert(true);
        setTimeout(() => {
          logout();
        }, 5000);
      } else {
        await updateParentStatus({ status: isActive }, data.id);
        queryClient.invalidateQueries(['parents-directory']);
        setIsEditing(false);
        setIsLoading(false);
      }
    });
  };

  const getStateCode = (stateId: number, states: StateDto[]) => {
    const state = states?.find((s) => s.id === stateId);
    return state ? state.code : null;
  };

  return (
    <>
      <FormProvider {...methods}>
        <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(handleSave)} id={formId}>
          <div className="">
            <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
              {isEditing && (
                <div className="tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
                  <div className={`tw-flex tw-min-h-[44px] tw-space-x-4xl tw-pb-2xl`}>
                    <div className="md:tw-w-1/4 sm:tw-w-1/2">
                      <div className="tw-text-sm-semibold tw-text-secondary">Name</div>
                    </div>
                    <div className="tw-space-y-sm md:tw-w-2/4 sm:tw-w-1/2">
                      <div className="tw-flex tw-space-x-3xl">
                        <div className="tw-w-1/2">
                          <CustomInput
                            control={methods.control}
                            type="text"
                            placeholder="First"
                            name="firstName"
                            defaultValue={data?.firstName ?? ''}
                          />
                        </div>
                        <div className="tw-w-1/2">
                          <CustomInput
                            control={methods.control}
                            type="text"
                            placeholder="Last"
                            name="lastName"
                            defaultValue={data?.lastName ?? ''}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
              <div className="tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
                <div className={`tw-flex tw-min-h-[44px] tw-space-x-4xl tw-pb-2xl`}>
                  <div className="md:tw-w-1/4 sm:tw-w-1/2">
                    <div className="tw-text-sm-semibold tw-text-secondary">Home Email address</div>
                  </div>
                  <div className="tw-space-y-sm md:tw-w-2/4 sm:tw-w-1/2">
                    <div className="tw-flex tw-space-x-3xl">
                      <div className="tw-w-full">
                        {isLoadingData ? (
                          <TextSkeleton width={100} />
                        ) : isEditing ? (
                          <CustomInput
                            control={methods.control}
                            type="email"
                            placeholder="info@myedna.net"
                            name="email"
                            defaultValue={data?.email ?? ''}
                          />
                        ) : (
                          <a
                            className="tw-text-md-normal tw-text-primary hover:tw-text-md-medium hover:tw-text-primary"
                            href={`mailto:${data?.email}`}
                          >
                            {data?.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
              <div className="tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
                <div className={`tw-flex tw-min-h-[44px] tw-space-x-4xl tw-pb-2xl`}>
                  <div className="md:tw-w-1/4 sm:tw-w-1/2">
                    <div className="tw-text-sm-semibold tw-text-secondary">Work Email address</div>
                  </div>
                  <div className="tw-space-y-sm md:tw-w-2/4 sm:tw-w-1/2">
                    <div className="tw-flex tw-space-x-3xl">
                      <div className="tw-w-full">
                        {isLoadingData ? (
                          <TextSkeleton width={100} />
                        ) : isEditing ? (
                          <CustomInput
                            control={methods.control}
                            type="email"
                            placeholder="info@myedna.net"
                            name="workEmail"
                            defaultValue={data?.workEmail ?? ''}
                          />
                        ) : (
                          <a
                            className="tw-text-md-normal tw-text-primary hover:tw-text-md-medium hover:tw-text-primary"
                            href={`mailto:${data?.workEmail}`}
                          >
                            {data?.workEmail}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
              <div className="tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
                <div className={`tw-flex tw-min-h-[44px] tw-space-x-4xl tw-pb-2xl`}>
                  <div className="md:tw-w-1/4 sm:tw-w-1/2">
                    <div className="tw-text-sm-semibold tw-text-secondary">Cell Phone Number</div>
                  </div>
                  <div className="tw-space-y-sm md:tw-w-2/4 sm:tw-w-1/2">
                    <div className="tw-flex tw-space-x-3xl">
                      <div className="tw-w-full">
                        {isLoadingData ? (
                          <TextSkeleton width={100} />
                        ) : isEditing ? (
                          <CustomInput
                            control={methods.control}
                            type="phone"
                            name="cellPhone"
                            placeholder="XXX-XXX-XXXX"
                            containerClassName={'tw-flex-1'}
                            defaultValue={data?.cellPhone ?? ''}
                            icon={'phone'}
                          />
                        ) : checkPhoneNumber(data?.cellPhone!) ? (
                          <a
                            className="tw-text-md-normal tw-text-primary hover:tw-text-md-medium hover:tw-text-primary"
                            href={`tel:${data?.cellPhone}`}
                          >
                            {data?.cellPhone}
                          </a>
                        ) : (
                          <span className="tw-text-md-normal">{data?.cellPhone}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
              <div className="tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
                <div className={`tw-flex tw-min-h-[44px] tw-space-x-4xl tw-pb-2xl`}>
                  <div className="md:tw-w-1/4 sm:tw-w-1/2">
                    <div className="tw-text-sm-semibold tw-text-secondary">Home Phone</div>
                  </div>
                  <div className="tw-space-y-sm md:tw-w-2/4 sm:tw-w-1/2">
                    <div className="tw-flex tw-space-x-3xl">
                      <div className="tw-w-full">
                        {isLoadingData ? (
                          <TextSkeleton width={100} />
                        ) : isEditing ? (
                          <CustomInput
                            control={methods.control}
                            type="phone"
                            name="homePhone"
                            placeholder="XXX-XXX-XXXX"
                            containerClassName="tw-flex-1"
                            defaultValue={data?.homePhone ?? ''}
                            icon="phone-call"
                          />
                        ) : checkPhoneNumber(data?.homePhone!) ? (
                          <a
                            className="tw-text-md-normal tw-text-primary hover:tw-text-md-medium hover:tw-text-primary"
                            href={`tel:${data?.homePhone}`}
                          >
                            {data?.homePhone}
                          </a>
                        ) : (
                          <span className="tw-text-md-normal">{data?.homePhone}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
              <div className="tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
                <div className={`tw-flex tw-min-h-[44px] tw-space-x-4xl tw-pb-2xl`}>
                  <div className="md:tw-w-1/4 sm:tw-w-1/2">
                    <div className="tw-text-sm-semibold tw-text-secondary">Address</div>
                  </div>
                  <div className="tw-space-y-sm md:tw-w-2/4 sm:tw-w-1/2">
                    <div className="tw-flex tw-space-x-3xl">
                      <div className="tw-w-full tw-p-0 tw-space-y-xl">
                        {isLoadingData ? (
                          <TextSkeleton width={350} />
                        ) : isEditing ? (
                          <>
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
                                defaultValue={data?.addressLine1 ?? ''}
                              />
                              <CustomInput
                                control={methods.control}
                                type="text"
                                name="addressLine2"
                                placeholder="Address Line 2"
                                containerClassName="tw-w-1/2"
                                defaultValue={data?.addressLine2 ?? ''}
                              />
                            </div>
                            <div className="tw-flex tw-p-0 tw-space-x-3xl">
                              <CustomInput
                                control={methods.control}
                                type="text"
                                name="city"
                                placeholder="City"
                                containerClassName="tw-w-1/2"
                                defaultValue={data?.city ?? ''}
                              />
                              <CustomInput
                                control={methods.control}
                                type="text"
                                name="zipcode"
                                placeholder="Zipcode"
                                containerClassName="tw-w-1/2"
                                defaultValue={data?.zipcode ?? ''}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="tw-text-md-normal tw-text-primary">
                            {`
                              ${data?.addressLine1 ? data?.addressLine1 : ''}${data?.city ? ', ' + data?.city : ''}${
                              data?.stateId ? `, ${getStateCode(data.stateId, states)}` : ''
                            }
                              ${data?.zipcode ? ' ' + data?.zipcode : ''}
                            `}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
              <div className="tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
              <div className={`tw-flex tw-min-h-[44px] tw-space-x-4xl tw-pb-2xl`}>
                  <div className="md:tw-w-1/4 sm:tw-w-1/2">
                    <div className="tw-text-sm-semibold tw-text-secondary">Occupation</div>
                  </div>
                  <div className="tw-space-y-sm md:tw-w-2/4 sm:tw-w-1/2">
                    <div className="tw-flex tw-space-x-3xl">
                      <div className="tw-w-full tw-flex tw-p-0 tw-space-x-3xl">
                        {isLoadingData ? (
                          <TextSkeleton width={350} />
                        ) : isEditing ? (
                          <>
                            <div className="tw-w-1/3">
                              <CustomInput
                                control={methods.control}
                                type="text"
                                placeholder="Profession"
                                name="profession"
                                defaultValue={data?.position ?? ''}
                              />
                            </div>
                            <div className="tw-w-1/3">
                              <CustomInput
                                control={methods.control}
                                type="text"
                                placeholder="Job Title"
                                name="jobTitle"
                                defaultValue={data?.jobTitle ?? ''}
                              />
                            </div>
                            <div className="tw-w-1/3">
                              <CustomInput
                                control={methods.control}
                                type="text"
                                placeholder="Employer"
                                name="employer"
                                defaultValue={data?.employer ?? ''}
                              />
                            </div>
                          </>
                        ) : (
                          <div className="tw-text-md-normal tw-text-primary">
                            {`
                              ${data?.profession ? data?.profession : ''}${data?.jobTitle ? ', ' + data?.jobTitle : ''}${
                              data?.employer ? ', ' + data?.employer : ''
                            }
                            `}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
              <div className="tw-space-x-lg tw-border tw-border-t-0 tw-border-x-0 tw-border-solid tw-border-secondary">
                <div className="tw-flex tw-space-x-4xl tw-pb-2xl">
                  <div className="md:tw-w-1/4 sm:tw-w-1/2">
                    <div className="tw-text-sm-semibold tw-text-secondary">Identification Photo</div>
                    <div className="tw-text-sm-regular tw-text-tertiary">
                      This will be used to for campus security and pickup / drop-off verification.
                    </div>
                  </div>
                  <div className="md:tw-w-2/4 sm:tw-w-1/2">
                    <div className="tw-flex md:tw-flex-row sm:tw-flex-col sm:tw-space-y-md tw-space-x-3xl">
                      {isEditing ? (
                        <>
                          <Avatar photoSize={64} link={data?.profilePicture} />
                          <div className="tw-w-full">
                            <CustomInput
                              control={methods.control}
                              id={data?.id}
                              component="Parent"
                              label="profile image"
                              type="file"
                              name="profileImage"
                              isProfile={true}
                              icon="cloud"
                              onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                                const file = e.target.files;

                                if (file) {
                                  methods.setValue('profileImage', file);
                                } else {
                                  // Handle the case when files are null (optional)
                                  console.error('No files selected');
                                }
                              }}
                            />
                          </div>
                        </>
                      ) : data ? (
                        <Avatar photoSize={64} link={data?.profilePicture} />
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="tw-min-w-[1016px] tw-mx-4xl  tw-pt-2xl">
              <div className="">
                <div className={`tw-flex tw-min-h-[44px] tw-space-x-4xl tw-pb-4xl`}>
                  <div className="md:tw-w-1/4 sm:tw-w-1/2">
                    <div className="tw-text-sm-semibold tw-text-secondary">Active Profile</div>
                  </div>
                  <div className="tw-space-y-sm md:tw-w-2/4 sm:tw-w-1/2">
                    <div className="tw-flex tw-space-x-3xl">
                      <div className="tw-w-full">
                        {isLoadingData ? (
                          <TextSkeleton width={30} />
                        ) : isEditing ? (
                          <div className="tw-flex tw-w-full tw-space-x-2xl">
                            <div className="tw-w-full">
                              <CustomBooleanRadioButton
                                name="isActive"
                                control={methods.control}
                                defaultValue={data.isActive}
                                onChange={(value: boolean) => {
                                  if (value) setIsActive(true);
                                  else setIsActive(false);
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div>{!data ? '' : data?.isActive === true ? 'Yes' : 'No'}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {isEditing && (
              <div className="tw-py-xl tw-flex tw-items-center tw-justify-end tw-border tw-border-b-0 tw-border-x-0 tw-border-solid tw-border-secondary">
                <div className="tw-flex tw-min-w-[1016px] tw-mx-4xl  tw-items-center tw-justify-end tw-space-x-lg">
                  <div>
                    <button
                      className={
                        'tw-h-[40px] tw-text-sm-semibold tw-flex tw-items-center tw-justify-center tw-py-10px tw-px-14px tw-bg-white tw-text-button-secondary-color-fg tw-rounded-md tw-border tw-border-brand tw-border-solid tw-shadow-sm hover:tw-bg-button-secondary-bg-hover'
                      }
                      onClick={() => setIsEditing(false)}
                    >
                      <span>Cancel</span>
                    </button>
                  </div>
                  <div>
                    <button
                      className={
                        'tw-h-[40px] tw-w-[88px] tw-space-x-xs tw-text-sm-semiboldtw-flex tw-items-center tw-justify-center tw-py-10px tw-px-14px tw-bg-brand tw-text-white tw-rounded-md tw-border tw-border-brand tw-border-solid tw-shadow-sm hover:tw-bg-button-primary-hover'
                      }
                      type="submit"
                      form={formId}
                    >
                      {isLoading ? (
                        <div role="status">
                          <LoadingSpinner width={25} />
                        </div>
                      ) : (
                        <>
                          <SaveIcon stroke={'white'} />
                          <span>Save</span>
                        </>
                      )}
                    </button>
                  </div>
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

export default ParentProfileTab;
