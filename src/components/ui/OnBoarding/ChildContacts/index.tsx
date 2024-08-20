import { NextPage } from 'next';
import { CustomModal } from '@/components/ui/CustomModal';
import ImageBrand from '@/components/common/ImageBrand';
import OnboardingProgress, { ProgressProps } from '../components/Progress';
import { ChangeEvent, useEffect, useState } from 'react';
import ArrowCircleRightIcon from '@/components/svg/ArrowCircleRight';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQueryClient } from '@tanstack/react-query';
import CustomButton from '@/components/ui//CustomButton';
import PlusCircleIcon from '@/components/svg/PlusCircle';
import { UpdateUserContactDto } from '@/dtos/UserContactDto';
import UserContactMapModel from '@/models/UserContactModel';
import TrashIcon from '@/components/svg/TrashIcon';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import { UpdateUserContactValidation } from '@/validation/UserContactValidationSchema';
import { relationShipRoles } from '../../AddOrUpdateContact';
import CustomDropdown from '@/components/common/NewCustomFormControls/CustomDropdown';
import {
  postAddContactToStudent,
  updateOnboardingStep,
  deleteOnboardingStudentContact,
} from '@/services/api/updateOnboarding';
import { StudentBasicDto } from '@/dtos/StudentDto';
import { useOnboardingStudentQuery } from '@/hooks/queries/useOnboardingQuery';
import { LoadingSpinner } from '@/components/svg/LoadingSpinner';

const ChildContacts: NextPage<ProgressProps> = ({
  currentStep,
  setCurrentStep,
  stepText,
  students,
  selectedStudent,
  parent,
  code,
  setSelectedStudentId,
  setVerified,
}) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedRole, setSelectedRole] = useState<{ id: number; name: string } | null>({ id: 1, name: 'Guardian' });

  const { data: studentInfo } = useOnboardingStudentQuery({
    code: code!,
    studentId: selectedStudent?.id || parent?.students?.[0].id!,
  });

  const handleNext = async () => {
    setShowLoader(true);
    const requestData = {
      step: 6,
      parentId: parent?.id,
    };

    await updateOnboardingStep(requestData, code!).then(() => {
      queryClient.invalidateQueries(['onboarding-student', code, studentInfo?.id]);
      queryClient.invalidateQueries(['onboarding-parent', code]);
      setShowLoader(false);
      setVerified(false);
      setCurrentStep(2);
    });
  };

  const handleOncancel = async () => {
    setShowLoader(true);
    const requestData = {
      step: students && students.length === 1 ? 2 : 0,
      studentId: studentInfo?.id, //fix back button
      // parentId: parent?.id,
    };

    await updateOnboardingStep(requestData, code!).then(() => {
      queryClient.invalidateQueries(['onboarding-student-questions-inputform', studentInfo?.id]);
      queryClient.invalidateQueries(['onboarding-student', code, studentInfo?.id]);
      queryClient.invalidateQueries(['onboarding-parent', code]);
      setShowLoader(false);
    });
  };

  const handleDeleteUserContact = async (userContactMapId: number) => {
    await deleteOnboardingStudentContact(code!, userContactMapId).then(() => {
      console.log('contact delete', userContactMapId);
      queryClient.invalidateQueries(['onboarding-student', code, studentInfo?.id]);
    });
  };

  const handleOncancelForm = () => {
    setShowForm(false);
  };

  const methods = useForm<UpdateUserContactDto>({
    resolver: yupResolver(UpdateUserContactValidation()),
  });
  const pickupAuthorization = methods.watch('pickupAuthorization');

  const handleSave = async (data: UpdateUserContactDto) => {
    setShowLoader(true);

    try {
      const formData = new FormData();

      if (data.role !== 'Guardian') {
        data.sendProfileOnboardingEmail = false;
      }
      if (!data.phone) {
        data.phone = null;
      }

      Object.keys(data).forEach((key) => {
        const value = data[key as keyof UpdateUserContactDto];
        if (key === 'profileImage' || key === 'licenseImage') {
          let field = data?.[key] && data?.[key]![0] ? data?.[key]![0] : null;
          formData.append(key, field as File);
        } else if (key === 'childAccountAccess') {
          let field = String(value);
          formData.append(key, field);
        } else if (key === 'role') {
          let field = String(selectedRole && selectedRole.name);
          formData.append(key, field as string);
        } else {
          formData.append(key, value as string);
        }
      });
      await postAddContactToStudent(formData, code!);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      queryClient.invalidateQueries(['onboarding-student', code, studentInfo?.id]);
      methods.reset();
      setShowForm(false);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    methods.reset();
    if (showForm) {
      setSelectedRole({ id: 1, name: 'Guardian' });
      methods.setValue('role', 'Guardian');
      methods.setValue('lastName', '');
      methods.setValue('firstName', '');
      methods.setValue('email', '');
      methods.setValue('relationship', '');
    }
  }, [showForm]);

  useEffect(() => {
    if (selectedRole && selectedRole.name === 'Guardian') {
      methods.setValue('isEmergencyContact', true);
      methods.setValue('pickupAuthorization', false);
    } else {
      methods.setValue('isEmergencyContact', false);
    }
  }, [selectedRole]);

  return (
    <>
      <CustomModal.Header>
        <div className="tw-space-y-xl">
          <div className="tw-flex tw-items-center tw-justify-center">
            <ImageBrand size={48} />
          </div>
          <div className="tw-space-y-xs tw-text-center">
            <div className="tw-text-lg-semibold tw-text-primary">Add Personal Contacts</div>
            <div className="tw-text-sm-regular tw-text-tertiary">
              {`These contacts are people who are important to your children. We use these contacts to verify who comes to our campus, picks up children, and communicates with our school. These contacts will be added to your children’s profile and you can edit or add more later. Emergency contacts will be contacted in the order set.`}
            </div>
          </div>
        </div>
      </CustomModal.Header>
      <CustomModal.Content>
        <div className="tw-mb-3xl">
          <OnboardingProgress
            stepText={stepText}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            setSelectedStudentId={setSelectedStudentId}
            setVerified={setVerified}
          />
        </div>
        <div className="tw-space-y-xl">
          {studentInfo &&
            studentInfo.userContactMap &&
            studentInfo.userContactMap.length > 0 &&
            studentInfo.userContactMap.map((contact: UserContactMapModel) => (
              <div
                key={`${contact?.contact?.firstName}-${contact?.contact?.lastName}`}
                className="tw-flex tw-items-center tw-border tw-border-solid tw-border-secondary tw-rounded-full tw-py-xl tw-px-2xl tw-justify-between"
              >
                <div className="tw-text-lg-regular tw-text-black">{`${contact?.contact?.firstName} ${contact?.contact?.lastName}`}</div>
                <div className="tw-flex tw-items-center tw-space-x-md">
                  <div
                    className={`tw-flex tw-space-x-md ${
                      parent?.email === contact?.contact?.email ? 'tw-disabled' : 'tw-cursor-pointer'
                    }`}
                    onClick={() => {
                      parent?.email != contact?.contact?.email && handleDeleteUserContact(contact.id);
                    }}
                  >
                    <TrashIcon color={parent?.email != contact?.contact?.email ? 'gray-primary' : 'gray-secondary'} />
                  </div>
                </div>
              </div>
            ))}
        </div>
        {showForm ? (
          <FormProvider {...methods}>
            <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(handleSave)} id="add-contact">
              <div className="tw-flex tw-flex-col tw-space-y-xl tw-pb-4xl tw-pt-xl">
                <div className="tw-space-y-sm">
                  <div className="tw-text-sm-medium tw-text-secondary">Name</div>
                  <div className="tw-flex tw-gap-x-3 tw-w-full">
                    <CustomInput
                      control={methods.control}
                      type="text"
                      name="firstName"
                      placeholder="First"
                      containerClassName="tw-flex-1"
                    />

                    <CustomInput
                      control={methods.control}
                      type="text"
                      name="lastName"
                      placeholder="Last"
                      containerClassName="tw-flex-1"
                    />
                  </div>
                </div>

                <div className="tw-space-y-sm">
                  <div className="tw-text-sm-medium tw-text-secondary">Email</div>
                  <CustomInput
                    control={methods.control}
                    type="email"
                    name="email"
                    placeholder="info@myedna.net"
                    containerClassName="tw-flex-1"
                  />
                </div>

                <div className="tw-space-y-sm">
                  <div className="tw-text-sm-medium tw-text-secondary">Relationship</div>
                  <div className="tw-flex tw-flex-row tw-gap-x-3 tw-w-full">
                    <CustomInput
                      control={methods.control}
                      type="text"
                      name="relationship"
                      placeholder="Mom, Dad, Grandma, etc.."
                      containerClassName="tw-flex-1"
                    />
                    <CustomDropdown
                      selectedItems={selectedRole}
                      setSelectedItems={setSelectedRole}
                      data={relationShipRoles}
                      component="Role"
                      control={methods.control}
                      name="role"
                      defaultValue="Guardian" // Set default value to "Guardian"
                    />
                  </div>
                </div>
                {selectedRole?.name !== 'Guardian' && (
                  <div className="tw-space-y-sm">
                    <div className="tw-text-sm-medium tw-text-secondary">Phone</div>
                    <CustomInput
                      control={methods.control}
                      type="phone"
                      name="phone"
                      placeholder="XXX-XXX-XXXX"
                      containerClassName="tw-flex-1"
                      icon="phone"
                    />
                  </div>
                )}

                {selectedRole?.name !== 'Guardian' && (
                  <div className="tw-flex tw-flex-col tw-space-y-xl">
                    <div className="tw-space-y-sm">
                      <CustomInput
                        control={methods.control}
                        type="file"
                        name="profileImage"
                        label="profile photo"
                        containerClassName="tw-flex-1"
                        isProfile={false}
                        component={'Contact'}
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

                    <>
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Pickup Authorization</div>
                        <div className="tw-flex tw-w-full tw-space-x-2xl">
                          <CustomInput
                            control={methods.control}
                            type="radio"
                            name="pickupAuthorization"
                            label="No"
                            containerClassName="tw-flex-1"
                            value={false}
                          />
                          <CustomInput
                            control={methods.control}
                            type="radio"
                            name="pickupAuthorization"
                            label="Yes"
                            containerClassName="tw-flex-1"
                            value={true}
                          />
                        </div>
                      </div>
                      {pickupAuthorization && (
                        <>
                          <div>
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
                                  // Handle the case when files are null (optional)
                                  console.error('No files selected');
                                }
                              }}
                            />
                          </div>
                          <div className="tw-space-y-sm">
                            <div className="tw-text-sm-medium tw-text-secondary">{`Driver's License Number`}</div>
                            <CustomInput
                              control={methods.control}
                              type="text"
                              name="licenseNumber"
                              placeholder="XXXXXXXXXXX"
                              containerClassName="tw-flex-1"
                            />
                          </div>
                        </>
                      )}
                    </>
                    <div className="tw-space-y-sm">
                      <div className="tw-text-sm-medium tw-text-secondary">Emergency Contact</div>
                      <div className="tw-w-full tw-flex tw-items-center tw-justify-center tw-space-x-lg">
                        <CustomInput
                          control={methods.control}
                          type="radio"
                          name="isEmergencyContact"
                          label="No"
                          containerClassName="tw-flex-1"
                          value={false}
                        />
                        <CustomInput
                          control={methods.control}
                          type="radio"
                          name="isEmergencyContact"
                          label="Yes"
                          containerClassName="tw-flex-1"
                          value={true}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </FormProvider>
        ) : (
          <CustomButton
            text="Add Contact"
            btnSize="sm"
            heirarchy="link-gray"
            iconTrailing={<PlusCircleIcon color="brand" />}
            className="!tw-text-brand tw-pt-2xl tw-pb-4xl"
            onClick={() => setShowForm(true)}
          />
        )}
      </CustomModal.Content>
      {showForm ? (
        <CustomModal.Footer
          showLoader={showLoader}
          hasCancel={true}
          cancelText="Cancel"
          submitText="Save"
          submitIcon={showLoader ? <LoadingSpinner /> : <ArrowCircleRightIcon />}
          formId="add-contact"
          onClick={() => handleSave}
          onCancel={handleOncancelForm}
          flex="row"
          className="!tw-flex-row-reverse !tw-space-x-lg !tw-pt-0"
          submitClass="!tw-h-[44px] !tw-w-[98px]"
          cancelClass="!tw-w-[100px] tw-text-button-secondary-fg tw-border-primary hover:tw-bg-secondary"
        />
      ) : (
        <CustomModal.Footer
          showLoader={showLoader}
          hasCancel={true}
          cancelText="Cancel"
          submitText="Next"
          submitIcon={showLoader ? <LoadingSpinner /> : <ArrowCircleRightIcon />}
          formId=""
          onClick={handleNext}
          onCancel={handleOncancel}
          flex="row"
          className="!tw-flex-row-reverse !tw-space-x-lg !tw-pt-0"
          submitClass="!tw-h-[44px] !tw-w-[98px]"
          cancelClass="!tw-w-[100px] tw-text-button-secondary-fg tw-border-primary hover:tw-bg-secondary"
        />
      )}
    </>
  );
};

export default ChildContacts;
