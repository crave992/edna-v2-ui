import { useState, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotesCloseIcon from '@/components/svg/NotesCloseIcon';
import NotesSpinner from '@/components/svg/NotesSpinner';
import SaveIcon from '@/components/svg/SaveIcon';
import { useQueryClient } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { UpdateUserContactValidation } from '@/validation/UserContactValidationSchema';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import CustomDropdown from '@/components/common/NewCustomFormControls/CustomDropdown';
import { addContact } from '@/services/api/addContact';
import { UpdateUserContactDto } from '@/dtos/UserContactDto';
import { updateContact } from '@/services/api/updateContact';
import { deleteContact } from '@/services/api/deleteContact';
import TrashIcon from '@/components/svg/TrashIcon';
import UserStaffContactValidation from '@/validation/UserStaffContactValidationSchema';
import CustomCheckbox from '@/components/common/NewCustomFormControls/CustomCheckbox';
import { useFocusContext } from '@/context/FocusContext';
import CustomButton from '../CustomButton';
import { updateParentStatus } from '@/services/api/updateParent';
import { useCountriesQuery } from '@/hooks/queries/useCountriesQuery';
import { useStatesQuery } from '@/hooks/queries/useStatesQuery';
import { useParentDirectoryQuery, useParentQuery, useParentsDirectoryQuery } from '@/hooks/queries/useParentQuery';

interface AddOrUpdateContactProps {
  showModal?: boolean;
  setShowModal: Function;
  component: string;
  isEditing: boolean;
  id: number;
  contact?: UpdateUserContactDto | undefined;
  setIsEditing: Function;
}

export const relationShipRoles = [
  { id: 1, name: 'Guardian' },
  { id: 2, name: 'Family/Friend' },
  { id: 3, name: 'Childcare' },
  { id: 4, name: 'Healthcare' },
];

export default function AddOrUpdateContact({
  showModal,
  setShowModal,
  component,
  isEditing,
  setIsEditing,
  id,
  contact,
}: AddOrUpdateContactProps) {
  const [selectedState, setSelectedState] = useState<{ id: number; name: string } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{ id: number; name: string } | null>(null);
  const [selectedRole, setSelectedRole] = useState<{ id: number; name: string } | null>({ id: 1, name: 'Guardian' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
  const [shouldConfirm, setShouldConfirm] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { currentUserRoles } = useFocusContext();

  const { data: countries } = useCountriesQuery();
  const { data: states } = useStatesQuery(selectedCountry?.id!);
  const { data: ParentData } = useParentDirectoryQuery(contact?.contact?.parentId!);

  const disabledForms =
    !currentUserRoles?.hasAdminRoles && id != currentUserRoles?.staffId && !currentUserRoles?.isParent;

  const methods = useForm<UpdateUserContactDto>({
    resolver: yupResolver(component === 'Staff' ? UserStaffContactValidation(isEditing) : UpdateUserContactValidation(isEditing)),
  });

  useEffect(() => {
    if (isEditing && contact) {
      if (contact?.contact?.phone) methods.setValue('phone', contact?.contact?.phone);
      if (contact?.contact?.phone == 'null') methods.setValue('phone', '');
      if (contact?.contact?.firstName) methods.setValue('firstName', contact?.contact?.firstName);
      if (contact?.contact?.lastName) methods.setValue('lastName', contact?.contact?.lastName);
      if (contact?.contact?.email) methods.setValue('email', contact?.contact?.email);
      if (contact?.contact?.licenseNumber) methods.setValue('licenseNumber', contact?.contact?.licenseNumber);
      if (contact?.contact?.country && !selectedCountry) {
        methods.setValue('countryId', contact?.contact?.country.id);
        setSelectedCountry(contact?.contact?.country);
      }
      if (contact?.contact?.state && !selectedState) {
        methods.setValue('stateId', contact?.contact?.state.id);
        setSelectedState(contact?.contact?.state);
      }
      methods.setValue('addressLine1', contact?.contact?.addressLine1);
      if (contact?.contact?.addressLine2) methods.setValue('addressLine2', contact?.contact?.addressLine2);
      if (contact?.contact?.city) methods.setValue('city', contact?.contact?.city);
      if (contact?.contact?.zipcode) methods.setValue('zipcode', contact?.contact?.zipcode);

      if (contact?.relationship) methods.setValue('relationship', contact?.relationship);
      if (contact?.role) {
        const roleData = relationShipRoles.find((role) => role.name === contact.role);
        if (roleData) {
          setSelectedRole(roleData);
          methods.setValue('role', String(roleData.name));
        } else {
          console.error('Role not found in relationShipRoles');
        }
      }
      methods.setValue('profileImage', null);

      if (typeof contact?.pickupAuthorization == 'boolean' && component === 'Student') {
        methods.setValue('pickupAuthorization', contact?.pickupAuthorization);
      }
      if (typeof contact?.isEmergencyContact == 'boolean') {
        methods.setValue('isEmergencyContact', contact?.isEmergencyContact);
      }
      //if (contact?.licenseNumber && component === 'Student') methods.setValue('licenseNumber', contact?.licenseNumber);
    } else {
      methods.reset();
      methods.setValue('isEmergencyContact', contact?.isEmergencyContact ? contact?.isEmergencyContact : false);
      methods.setValue('pickupAuthorization', contact?.pickupAuthorization ? contact?.pickupAuthorization : false);
      methods.setValue('role', contact?.role ? contact.role : 'Guardian');
    }
    methods.setValue('sendProfileOnboardingEmail', false);
    methods.setValue(component === 'Staff' ? 'staffId' : 'studentId', Number(id));
  }, [isEditing, contact, showModal]);

  useEffect(() => {
    if (ParentData && isEditing) {
      if (ParentData?.country) {
        methods.setValue('countryId', ParentData?.country.id);
        setSelectedCountry(ParentData?.country);
      }

      if (ParentData?.state) {
        methods.setValue('stateId', ParentData?.state.id);
        setSelectedState(ParentData?.state);
      }
      if (ParentData?.addressLine1) methods.setValue('addressLine1', ParentData?.addressLine1);
      if (ParentData?.addressLine2) methods.setValue('addressLine2', ParentData?.addressLine2);
      if (ParentData?.city) methods.setValue('city', ParentData?.city);
      if (ParentData?.zipcode) methods.setValue('zipcode', ParentData?.zipcode);
    }
  }, [ParentData, contact, isEditing, showModal]);

  useEffect(() => {
    if(contact == undefined){
      if (selectedRole && selectedRole.name === 'Guardian') {
        methods.setValue('isEmergencyContact', true);
        methods.setValue('pickupAuthorization', false);
      }
    }
  }, [selectedRole]);

  useEffect(() => {
    const body = document.querySelector('body');

    // Add the class to disable scrolling when the modal is open
    if (showModal) {
      body && body.classList.add('body-scroll-lock');
    } else {
      // Remove the class when the modal is closed
      body && body.classList.remove('body-scroll-lock');
    }

    // Cleanup effect
    return () => {
      body && body.classList.remove('body-scroll-lock');
    };
  }, [showModal]);

  const resetData = (type: string) => {
    if (type === 'reset') queryClient.invalidateQueries(['staff-contacts']);
    methods.reset();
    setSelectedRole(null);
    setIsLoading(false);
    setShowModal(false);
    setIsEditing(false);
  };

  const handleSave = async (data: UpdateUserContactDto) => {
    setIsLoading(true);
    const formData = new FormData();

    if (selectedRole?.name !== 'Guardian') {
      data.sendProfileOnboardingEmail = false;
    }
    if (!data.phone) {
      data.phone = '-';
    }
    // Ensure empty fields are set to null or an empty string
    data.addressLine2 = data.addressLine2 || '';
    data.city = data.city || '';
    data.zipcode = data.zipcode || '';

    Object.keys(data).forEach((key) => {
      const value = data[key as keyof UpdateUserContactDto];
      if (key === 'profileImage') {
        let field = data?.[key] && data?.[key]![0] ? data?.[key]![0] : null;
        formData.append(key, field as File);
      } else if (key === 'licenseImage') {
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
    new Response(formData).text().then(console.log);

    try {
      if (isEditing) {
        await updateContact(formData, Number(contact?.contact?.id));
      } else {
        await addContact(formData);
      }

      if (component == 'Student') {
        queryClient.invalidateQueries(['student-contacts']);
        queryClient.invalidateQueries(['students-directory']);
        queryClient.invalidateQueries(['parents-directory']);
      } else if (component == 'Staff') {
        queryClient.invalidateQueries(['staff-contacts']);
        queryClient.invalidateQueries(['staffs-directory']);
        queryClient.invalidateQueries(['parents-directory']);
      }

      resetData('reset');
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    try {
      await updateParentStatus({ status: false }, contact?.contact?.parentId || 0)
        .then(async () => {
          await deleteContact(contact?.id);
        })
        .finally(() => {
          if (component === 'Student') {
            queryClient.invalidateQueries(['student-contacts']);
            queryClient.invalidateQueries(['students-directory']);
          } else if (component === 'Staff') {
            queryClient.invalidateQueries(['staff-contacts']);
            queryClient.invalidateQueries(['staffs-directory']);
          }

          queryClient.invalidateQueries(['parents-directory']);
        });

      resetData('reset');
      setIsDeleteLoading(false);
      setShouldConfirm(false);
    } catch (error) {
      console.error('Error deleting contact', error);
    }
  };

  const pickupAuthorization = methods.watch('pickupAuthorization');

  return (
    <AnimatePresence>
      {showModal ? (
        <>
          {/* Backdrop */}
          <div className="tw-p-3xl tw-fixed tw-top-0 tw-left-0 tw-w-screen tw-flex tw-items-start tw-justify-center tw-overflow-y-scroll tw-max-h-screen tw-bg-black/[0.3] tw-z-20 tw-h-screen">
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="tw-w-[480px] tw-bg-white tw-shadow-xl tw-rounded-xl tw-z-50 tw-overflow-x-visible custom-thin-scrollbar"
            >
              <FormProvider {...methods}>
                <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(handleSave)}>
                  <div className="tw-p-3xl">
                    <div className="tw-mb-2xl">
                      <div className="tw-justify-between tw-flex">
                        <div className="tw-font-black tw-text-lg">
                          {!disabledForms ? (isEditing ? 'Edit' : 'Add') : ''} Contact
                        </div>
                        <span className="tw-cursor-pointer" onClick={() => resetData('cancel')}>
                          <NotesCloseIcon />
                        </span>
                      </div>
                      {isEditing && (
                        <div className="tw-text-sm-regular tw-text-tertiary ">
                          {contact?.contact?.firstName} {contact?.contact?.lastName}
                        </div>
                      )}
                    </div>

                    <div className="tw-flex tw-flex-col tw-space-y-xl">
                      <div className="tw-space-y-sm">
                        <div className="tw-text-sm-medium tw-text-secondary">Name</div>
                        <div className="tw-flex tw-gap-x-3 tw-w-full">
                          <CustomInput
                            control={methods.control}
                            type="text"
                            name="firstName"
                            placeholder="First"
                            containerClassName="tw-flex-1"
                            disabled={disabledForms}
                            autoFocus={true}
                          />

                          <CustomInput
                            control={methods.control}
                            type="text"
                            name="lastName"
                            placeholder="Last"
                            containerClassName="tw-flex-1"
                            disabled={disabledForms}
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
                          disabled={disabledForms}
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
                            disabled={disabledForms}
                          />
                          <CustomDropdown
                            disabled={disabledForms}
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

                      {selectedRole?.name === 'Guardian' && component === 'Student' && (
                        <div className="tw-flex tw-flex-row tw-items-center tx-gap-x-3 tw-w-full tw-mt-md">
                          <CustomCheckbox
                            name="sendProfileOnboardingEmail"
                            control={methods.control}
                            defaultValue={false}
                            label="Send profile onboarding email"
                            containerClass="tw-border tw-border-transparent tw-text-md-medium tw-text-secondary"
                          />
                        </div>
                      )}

                      {(selectedRole?.name !== 'Guardian' || isEditing) && (
                        <div className="tw-space-y-sm">
                          <div className="tw-text-sm-medium tw-text-secondary">Phone</div>
                          <CustomInput
                            disabled={disabledForms}
                            control={methods.control}
                            type="phone"
                            name="phone"
                            placeholder="XXX-XXX-XXXX"
                            containerClassName="tw-flex-1"
                            icon="phone"
                          />
                        </div>
                      )}
                      {(selectedRole?.name !== 'Guardian' || isEditing) && (
                        <div>
                          <div className="tw-text-sm-medium tw-text-secondary">Address</div>
                          <div className="tw-flex tw-p-0 tw-gap-x-3 tw-mt-sm">
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
                            <div className="tw-flex tw-p-0 tw-gap-x-3 tw-mt-lg">
                              <CustomInput
                                control={methods.control}
                                type="text"
                                name="addressLine1"
                                placeholder="Address Line 1"
                                containerClassName="tw-w-1/2"
                              />
                              <CustomInput
                                control={methods.control}
                                type="text"
                                name="addressLine2"
                                placeholder="Address Line 2"
                                containerClassName="tw-w-1/2"
                              />
                            </div>
                            <div className="tw-flex tw-p-0 tw-gap-x-3 tw-mt-lg">
                              <CustomInput
                                control={methods.control}
                                type="text"
                                name="city"
                                placeholder="City"
                                containerClassName="tw-w-1/2"
                              />
                              <CustomInput
                                control={methods.control}
                                type="text"
                                name="zipcode"
                                placeholder="Zipcode"
                                containerClassName="tw-w-1/2"
                              />
                            </div>
                        </div>
                      )}

                      {(selectedRole?.name !== 'Guardian' || isEditing) && (
                        <div className="tw-flex tw-flex-col tw-space-y-xl">
                          <div className="tw-space-y-sm">
                            <CustomInput
                              disabled={disabledForms}
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
                          {component === 'Student' && (
                            <>
                              <div className="tw-space-y-sm">
                                <div className="tw-text-sm-medium tw-text-secondary">Pickup Authorization</div>
                                <div className="tw-flex tw-w-full tw-space-x-2xl">
                                  <CustomInput
                                    disabled={disabledForms}
                                    control={methods.control}
                                    type="radio"
                                    name="pickupAuthorization"
                                    label="No"
                                    containerClassName="tw-flex-1"
                                    value={false}
                                  />
                                  <CustomInput
                                    disabled={disabledForms}
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
                                      disabled={disabledForms}
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
                                      disabled={disabledForms}
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
                          )}
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

                    {!disabledForms && (
                      <div className="tw-pt-4xl tw-flex tw-items-center tw-justify-between">
                        <div className="tw-cursor-pointer">
                          {isEditing &&
                            (isDeleteLoading ? (
                              <div role="status" className="tw-cursor-progress">
                                <NotesSpinner />
                              </div>
                            ) : !shouldConfirm ? (
                              <div onClick={() => setShouldConfirm(true)} className="tw-flex tw-space-x-md">
                                <TrashIcon />
                                <div className="tw-text-md-semibold tw-text-tertiary">Delete Contact</div>
                              </div>
                            ) : (
                              <div className="tw-flex tw-justify-center tw-flex-col tw-items-center">
                                Are you sure?
                                <div className="tw-flex tw-flex-row tw-gap-lg">
                                  <button
                                    className="tw-h-[36px] tw-text-sm-semibold tw-text-secondary tw-flex tw-items-center tw-justify-center tw-py-md tw-px-xl tw-bg-white tw-rounded-md tw-border tw-border-secondary tw-border-solid tw-shadow-sm"
                                    type="button"
                                    onClick={() => setShouldConfirm(false)}
                                  >
                                    No
                                  </button>
                                  <button
                                    className="tw-h-[36px] tw-text-sm-semibold tw-text-white tw-flex tw-items-center tw-justify-center tw-py-md tw-px-xl tw-bg-button-primary-error tw-rounded-md tw-border tw-border-button-primary-error tw-border-solid tw-shadow-sm"
                                    type="button"
                                    onClick={() => handleDelete()}
                                  >
                                    Yes
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                        <div className="tw-flex tw-items-center tw-justify-center tw-space-x-lg">
                          <CustomButton
                            onClick={() => resetData('cancel')}
                            text="Cancel"
                            btnSize="lg"
                            heirarchy="secondary-gray"
                          />
                          <CustomButton
                            text="Save"
                            btnSize="lg"
                            heirarchy="primary"
                            iconLeading={isLoading ? <NotesSpinner /> : <SaveIcon />}
                            type="submit"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </FormProvider>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
