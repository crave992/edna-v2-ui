import { NextPage } from 'next';
import { CustomModal } from '@/components/ui/CustomModal';
import ImageBrand from '@/components/common/ImageBrand';
import OnboardingProgress, { ProgressProps } from '../components/Progress';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import ArrowCircleRightIcon from '@/components/svg/ArrowCircleRight';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import { FormProvider, useForm } from 'react-hook-form';
import { ParentUpdateModel } from '@/models/ParentModel';
import { yupResolver } from '@hookform/resolvers/yup';
import { ParentUpdateOnboardingValidationSchema } from '@/validation/ParentValidationSchema';
import CustomDropdown from '@/components/common/NewCustomFormControls/CustomDropdown';
import { useQueryClient } from '@tanstack/react-query';
import { updateOnboardingStep, updateParentOnboarding } from '@/services/api/updateOnboarding';
import CheckCircleIcon from '@/components/svg/CheckCircle';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import { useCountriesQuery } from '@/hooks/queries/useCountriesQuery';
import { useStatesQuery } from '@/hooks/queries/useStatesQuery';
import LoadingSpinner from '@/components/svg/LoadingSpinner';
import SaveIcon from '@/components/svg/SaveIcon';

export interface RowType {
  label: string;
  subLabel?: string;
  rightElement?: ReactNode;
  children?: ReactNode;
}

const ParentProfile: NextPage<ProgressProps> = ({
  currentStep,
  setCurrentStep,
  stepText,
  data,
  code,
  setSelectedStudentId,
  setVerified,
}) => {
  const [showLoader, setShowLoader] = useState(false);
  const [selectedState, setSelectedState] = useState<{ id: number; name: string } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{ id: number; name: string } | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { data: countries } = useCountriesQuery();
  const { data: states } = useStatesQuery(selectedCountry?.id!);

  const methods = useForm<ParentUpdateModel>({
    resolver: yupResolver(ParentUpdateOnboardingValidationSchema),
  });

  useEffect(() => {
    if (data) {
      methods.setValue('parentId', data.id);
      methods.setValue('firstName', data.firstName);
      methods.setValue('lastName', data.lastName);
      methods.setValue('isEmergencyContact', true);
      methods.setValue('licenseNumber', data.licenseNumber);

      if (data.countryId) {
        methods.setValue('countryId', data.countryId || selectedCountry?.id!);
        setSelectedCountry(data.country ? { id: data.countryId, name: data.country.name } : null);
      }
      if (data.stateId) {
        methods.setValue('stateId', data.stateId || selectedState?.id!);
        setSelectedState(data.state ? { id: data.stateId, name: data.state.name } : null);
      }
      if (data.dateOfBirth) {
        setDateOfBirth(new Date(data.dateOfBirth));
        methods.setValue('dateOfBirth', data.dateOfBirth);
      }

      if(!data.isFullOnboarding && (data.currentOnboardingStep && data.currentOnboardingStep > 1)){
        setShowCompleted(true);
      }
    }
  }, [data]);

  const handleOncancel = async () => {
    const requestData = {
      step: 0,
      parentId: data?.id,
    };

    await updateOnboardingStep(requestData, code!).then(() => {
      queryClient.invalidateQueries(['onboarding-parent', code]);
      setShowLoader(false);
    });
  };

  const handleSave = async (values: ParentUpdateModel) => {
    setShowLoader(true);
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      const value = values[key as keyof ParentUpdateModel];
      if (key === 'profileImage') {
        let field = values?.[key] && values?.[key]![0] ? values?.[key]![0] : null;
        formData.append(key, field as File);
      } else if (key === 'licenseImage') {
        let field = values?.[key] && values?.[key]![0] ? values?.[key]![0] : null;
        formData.append(key, field as File);
      } else if (key === 'dateOfBirth') {
        formData.append(key, value as string);
      } else {
        formData.append(key, value as string);
      }
    });

    new Response(formData).text().then(console.log);
    await updateParentOnboarding(formData, code!);

    if (data) {
      const requestData = {
        step: 2,
        parentId: data?.id,
      };

      await updateOnboardingStep(requestData, code!).then(() => {
        if(!data.isFullOnboarding){
          setShowCompleted(true);
        } else {
          queryClient.invalidateQueries(['onboarding-parent', code]);
          setShowLoader(false);
        }
      });
    }
  };

  const Row = ({ label, subLabel, children }: RowType) => {
    return (
      <div className="tw-space-y-sm">
        <div className="tw-text-sm-semibold tw-text-secondary">{label}</div>
        {children}
      </div>
    );
  };

  const handlePickDate = (date: Date | null) => {
    setDateOfBirth(date);
    methods.setValue('dateOfBirth', date!);
  };

  return (
    <>
      <CustomModal.Header>
        <div className="tw-space-y-xl">
          <div className="tw-flex tw-items-center tw-justify-center">
            <ImageBrand size={48} />
          </div>
          <div className="tw-space-y-xs tw-text-center">
            <div className="tw-text-lg-semibold tw-text-primary">
              {showCompleted ? 'Account Setup Complete' : 'Create Your Parent Profile'}
            </div>
            <div className="tw-text-sm-regular tw-text-tertiary">
              {data && data.isFullOnboarding
                ? `Welcome, ${data?.firstName} ${data?.lastName}. To get your profile setup, please fill out the form below in full.`
                : showCompleted
                ? 'You may now close this window'
                : 'To get your profile setup, please fill out the form below in full.'}
            </div>
          </div>
        </div>
      </CustomModal.Header>
      <CustomModal.Content>
        {showCompleted ? (
          <div className="tw-flex tw-items-center tw-border tw-border-solid tw-border-secondary tw-rounded-full tw-py-xl tw-px-2xl tw-justify-between">
            <div className="tw-text-lg-regular tw-text-black">{`${data?.firstName} ${data?.lastName}`}</div>
            <div className="tw-flex tw-space-x-md">
              <div className="tw-text-sm-regular tw-text-tertiary">Setup Complete</div>
              <CheckCircleIcon />
            </div>
          </div>
        ) : (
          <div className="tw-space-y-xl">
            {data && data.isFullOnboarding && (
              <OnboardingProgress
                stepText={stepText}
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                setSelectedStudentId={setSelectedStudentId}
                setVerified={setVerified}
              />
            )}
            <FormProvider {...methods}>
              <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(handleSave)} id="update-parent">
                <input hidden name="parentId" defaultValue={data?.id} />
                {data && data.isFullOnboarding === false && (
                  <Row label="Name">
                    <div className="tw-flex tw-space-x-lg tw-pb-xl">
                      <CustomInput
                        control={methods.control}
                        type="text"
                        name="firstName"
                        defaultValue={data?.firstName}
                        disabled
                        containerClassName="tw-w-1/2"
                      />
                      <CustomInput
                        control={methods.control}
                        type="text"
                        name="lastName"
                        defaultValue={data?.lastName}
                        disabled
                        containerClassName="tw-w-1/2"
                      />
                    </div>
                  </Row>
                )}
                <div className="tw-space-y-xl">
                  <div className="tw-w-full">
                    <CustomInput
                      control={methods.control}
                      id={data?.id}
                      component="OnboardingParent"
                      label="profile image"
                      type="file"
                      name="profileImage"
                      isProfile={true}
                      icon={'cloud'}
                      code={code}
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
                  <div className="tw-mb-4">
                    <CustomDatePicker
                      name="dateOfBirth"
                      placeholder="Birthday"
                      selected={dateOfBirth}
                      onChange={(date: Date | null) => handlePickDate(date)}
                      useDropdownMode
                    />
                  </div>
                  <div className="tw-space-y-sm">
                    <div className="tw-text-sm-semibold tw-text-secondary">Cell Phone</div>
                    <CustomInput
                      control={methods.control}
                      type="phone"
                      name="cellPhone"
                      placeholder="XXX-XXX-XXXX"
                      containerClassName="tw-flex-1"
                      defaultValue={!data?.cellPhone || data?.cellPhone == 'null' ? '' : data?.cellPhone}
                      icon="phone"
                    />
                  </div>

                  <Row label="Home Phone">
                    <CustomInput
                      control={methods.control}
                      type="phone"
                      name="homePhone"
                      placeholder="XXX-XXX-XXXX"
                      containerClassName="tw-flex-1"
                      defaultValue={data?.homePhone ?? ''}
                      icon="phone-call"
                    />
                  </Row>
                  <Row label="Personal Email">
                    <CustomInput
                      control={methods.control}
                      type="email"
                      placeholder="info@myedna.net"
                      name="email"
                      defaultValue={data?.email}
                      disabled
                    />
                  </Row>

                  <div className="tw-space-y-sm">
                    <div className="tw-text-sm-semibold tw-text-secondary">Password</div>
                    <CustomInput control={methods.control} type="password" placeholder="••••••" name="password" />
                  </div>

                  <div className="tw-space-y-sm">
                    <div className="tw-text-sm-semibold tw-text-secondary">Address</div>
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
                  </div>

                  <Row label="Occupation">
                    <div className="tw-w-full tw-flex tw-p-0 tw-space-x-3xl">
                      <div className="tw-w-1/3">
                        <CustomInput
                          control={methods.control}
                          type="text"
                          placeholder="Profession"
                          name="profession"
                          defaultValue={data?.profession ?? ''}
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
                    </div>
                  </Row>
                  <div className="tw-space-y-xl">
                    <Row label="Driver's License Number">
                      <CustomInput
                        control={methods.control}
                        type="text"
                        name="licenseNumber"
                        placeholder="XXXXXXXXXXX"
                        containerClassName="tw-flex-1"
                      />
                    </Row>
                    <CustomInput
                      control={methods.control}
                      type="file"
                      name="licenseImage"
                      label="driver's license"
                      isProfile={false}
                      containerClassName="tw-flex-1"
                      onChange={async (e: ChangeEvent<HTMLInputElement>) => {
                        const files = e.target.files;
                        if (files) {
                          methods.setValue('licenseImage', files);
                        } else {
                          console.error('No files selected');
                        }
                      }}
                    />
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
        )}
      </CustomModal.Content>
      {showCompleted ? (
        <div className="tw-pb-3xl"></div>
      ) : (
        <CustomModal.Footer
          showLoader={showLoader}
          hasCancel={true}
          cancelText="Back"
          submitText={data?.isFullOnboarding ? 'Next' : 'Save'}
          submitIcon={
            showLoader ? <LoadingSpinner /> : data?.isFullOnboarding ? <ArrowCircleRightIcon /> : <SaveIcon />
          }
          formId="update-parent"
          onClick={() => handleSave}
          onCancel={handleOncancel}
          flex="row"
          className="!tw-flex-row-reverse !tw-space-x-lg"
          submitClass="!tw-h-[44px] !tw-w-[98px]"
          cancelClass="!tw-w-[74px] tw-text-button-secondary-fg tw-border-primary hover:tw-bg-secondary"
        />
      )}
    </>
  );
};

export default ParentProfile;
