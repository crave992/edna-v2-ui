import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotesCloseIcon from '@/components/svg/NotesCloseIcon';
import NotesSpinner from '@/components/svg/NotesSpinner';
import SaveIcon from '@/components/svg/SaveIcon';
import { useQueryClient } from '@tanstack/react-query';
import 'react-datepicker/dist/react-datepicker.css';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import * as Yup from 'yup';
import Avatar from '@/components/ui/Avatar';
import EditIcon from '@/components/svg/EditIcon';
import PrinterIcon from '@/components/svg/PrinterIcon';
import { UserEmergencyInfoDto } from '@/dtos/UserEmergencyInfoDto';
import StaffDto from '@/dtos/StaffDto';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import { postApiRequestOptionsFormData } from '@/utils/apiUtils';
import UserContactMapModel from '@/models/UserContactModel';
import { TagsInput } from 'react-tag-input-component';
import ReactToPrint from 'react-to-print';
import { StudentBasicDto } from '@/dtos/StudentDto';
import { useFocusContext } from '@/context/FocusContext';
import UserCard from '../UserCard';
import CustomMultiSelect from '@/components/common/NewCustomFormControls/CustomMultiSelect';
import { useSession } from 'next-auth/react';

interface UserEmergencyInformationProps {
  showModal?: boolean;
  setShowModal: Function;
  component: string;
  selectedUser: StaffDto | StudentBasicDto | undefined;
}

const schema = Yup.object().shape({
  severeAllergies: Yup.string(),
  nonSevereAllergies: Yup.string(),
  foodRestrictions: Yup.string(),
  medications: Yup.string(),
  conditionAndImpairments: Yup.string(),
  immunizations: Yup.string(),
  preferredHospital: Yup.string(),
  inCaseOfEmergency: Yup.string(),
});

export default function UserEmergencyInformation({
  showModal,
  setShowModal,
  component,
  selectedUser,
}: UserEmergencyInformationProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const { data: session} = useSession();

  const queryClient = useQueryClient();
  const printRef = useRef<HTMLDivElement>(null);
  const { currentUserRoles } = useFocusContext();

  const methods = useForm<UserEmergencyInfoDto>({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      severeAllergies: selectedUser?.userMedicalInformation?.severeAllergies || '',
      nonSevereAllergies: selectedUser?.userMedicalInformation?.nonSevereAllergies || '',
      foodRestrictions: selectedUser?.userMedicalInformation?.foodRestrictions || '',
      medications: selectedUser?.userMedicalInformation?.medications || '',
      conditionAndImpairments: selectedUser?.userMedicalInformation?.conditionAndImpairments || '',
      immunizations: selectedUser?.userMedicalInformation?.immunizations || '',
      preferredHospital: selectedUser?.userMedicalInformation?.preferredHospital || '',
      inCaseOfEmergency: selectedUser?.userMedicalInformation?.inCaseOfEmergency || '',
    },
  });

  useEffect(() => {
    if (showModal && selectedUser) {
      if (selectedUser.id) {
        methods.setValue(component === 'Student' ? 'studentId' : 'staffId', selectedUser.id);
      }
      if (selectedUser.userMedicalInformation) {
        const medicalInfo = selectedUser.userMedicalInformation;
        methods.setValue('conditionAndImpairments', medicalInfo?.conditionAndImpairments || '');
        methods.setValue('immunizations', medicalInfo?.immunizations || '');
        methods.setValue('inCaseOfEmergency', medicalInfo?.inCaseOfEmergency || '');
        methods.setValue('medications', medicalInfo?.medications || '');
        methods.setValue('nonSevereAllergies', medicalInfo?.nonSevereAllergies || '');
        methods.setValue('foodRestrictions', medicalInfo?.foodRestrictions || '');
        methods.setValue('preferredHospital', medicalInfo?.preferredHospital || '');
        methods.setValue('severeAllergies', medicalInfo?.severeAllergies || '');
        methods.setValue('id', medicalInfo?.id);
      }

      if(component == 'Staff'){
        //set editable if user is superadmin and above or has the same email
        var currentUserEmail = (selectedUser as StaffDto).email;
        var editable = currentUserRoles?.hasSuperAdminRoles || session?.user?.email === currentUserEmail;
        setIsEditable(editable);
      }
    } else {
      methods.reset();
    }
  }, [selectedUser, showModal]);

  useEffect(() => {
    const body = document.querySelector('body');

    if (showModal) {
      body && body.classList.add('body-scroll-lock');
    } else {
      body && body.classList.remove('body-scroll-lock');
      methods.reset();
    }

    return () => {
      body && body.classList.remove('body-scroll-lock');
    };
  }, [showModal]);

  const resetData = () => {
    setIsEdit(false);
    setIsLoading(false);
    methods.reset();
  };

  const handleSuccess = () => {
    resetData();
    setIsLoading(false);
    if (component === 'Student') queryClient.invalidateQueries(['students-directory', selectedUser?.id]);
    else queryClient.invalidateQueries(['staffs-directory', selectedUser?.id]);

    setShowModal(false);
  };

  const handleSave = async (data: UserEmergencyInfoDto) => {
    const options = postApiRequestOptionsFormData(localStorage.getItem('at'));
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof UserEmergencyInfoDto];
      formData.append(key, value as string);
    });

    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/UserMedicalInformation${
      data.id !== undefined ? '/' + data.id : ''
    }`;
    try {
      setIsLoading(true);
      const response = await fetch(url, {
        method: data.id !== undefined ? 'PUT' : 'POST',
        headers: options.headers,
        body: formData,
      });

      if (response.ok) {
        queryClient.invalidateQueries(['classes']);

        if (component == 'Staff') {
          queryClient.invalidateQueries(['staffs', selectedUser?.id]);
          queryClient.invalidateQueries(['staffs-directory']);
        }

        if (component == 'Student') {
          queryClient.invalidateQueries(['students-directory']);
          queryClient.invalidateQueries(['students', selectedUser?.id]);
        }

        handleSuccess();
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const userContacts: UserContactMapModel[] =
    selectedUser?.userContactMap && selectedUser?.userContactMap.length > 0
      ? selectedUser.userContactMap.filter((contact) => contact.isEmergencyContact)
      : [];

  type RowType = {
    label: string;
    name: string;
    defaultValue?: string;
    placeholder?: string;
    isTextArea?: boolean;
    isTagsInput?: boolean;
    info?: string;
  };

  const Row = ({ label, name, defaultValue, placeholder, isTextArea, isTagsInput, info }: RowType) => {
    const { control, setValue } = methods;
    const [tags, setTags] = useState<string[]>(
      typeof defaultValue === 'string' ? (defaultValue?.includes(',') ? defaultValue.split(', ') : [defaultValue]) : []
    );

    const handleTagsChange = (newtags: string[]) => {
      setTags(newtags);
      setValue(name as keyof UserEmergencyInfoDto, newtags.join(', '));
    };

    const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      event.preventDefault();
      const inputValue = event.currentTarget.value;
      if (inputValue !== '' && isTagsInput) {
        setTags((prevTags) => {
          if (!prevTags.includes(inputValue)) {
            const updatedTags = [...prevTags, inputValue];
            setValue(name as keyof UserEmergencyInfoDto, updatedTags.join(', '));
            // return updatedTags;
          }
          return prevTags;
        });
      }
    };

    return (
      <div className="tw-flex tw-min-h-[44px] tw-mb-xl last:tw-mb-0">
        <div className="tw-text-sm-medium tw-text-secondary tw-w-[160px] tw-mr-4xl">{label}</div>
        <div className="tw-flex tw-flex-col tw-space-y-sm">
          <div className="tw-w-[448px]">
            {isTextArea ? (
              <CustomInput
                control={control}
                type="textarea"
                defaultValue={defaultValue}
                name={name as keyof UserEmergencyInfoDto}
                // disabled={!isEdit}
                readOnly={!isEdit}
                placeholder={isEdit ? placeholder : ''}
                containerClassName={'tw-flex-1'}
              />
            ) : isTagsInput ? (
              isEdit ? (
                <Controller
                  control={control}
                  name={name as keyof UserEmergencyInfoDto}
                  render={({ field }) => {
                    return (
                      <CustomMultiSelect
                        {...field}
                        value={tags}
                        separators={[',', 'Enter']}
                        onChange={handleTagsChange}
                        onBlur={handleOnBlur}
                        placeHolder={
                          isEdit ? (methods.getValues(name as keyof UserEmergencyInfoDto) ? '' : placeholder) : ''
                        }
                        onExisting={(tag: string) => {
                          console.log(`${tag} already exists.`);
                        }}
                        name={name as keyof UserEmergencyInfoDto}
                      />
                    );
                  }}
                />
              ) : (
                <CustomInput
                  control={control}
                  type="text"
                  defaultValue={defaultValue}
                  name={name as keyof UserEmergencyInfoDto}
                  // disabled={true}
                  readOnly={true}
                  placeholder={isEdit ? placeholder : ''}
                  containerClassName="tw-flex-1"
                  inputClassName={
                    'disabled:tw-bg-primary disabled:tw-border-primary [-webkit-text-fill-color:tw-text-primary]'
                  }
                />
              )
            ) : (
              <CustomInput
                control={control}
                type="text"
                defaultValue={defaultValue}
                name={name as keyof UserEmergencyInfoDto}
                // disabled={!isEdit}
                readOnly={!isEdit}
                placeholder={isEdit ? placeholder : ''}
                containerClassName="tw-flex-1"
                inputClassName={
                  'disabled:tw-bg-primary disabled:tw-border-primary [-webkit-text-fill-color:tw-text-primary]'
                }
              />
            )}
            {isEdit && info && <div className="tw-text-sm-regular tw-text-tertiary tw-mt-sm">{isEdit && info}</div>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {showModal ? (
        <>
          {/* Backdrop */}
          <div className="tw-p-4xl tw-fixed tw-top-0 tw-left-0 tw-w-screen tw-flex tw-items-start tw-justify-center tw-overflow-y-scroll tw-max-h-screen tw-bg-black/[0.3] tw-z-20 !tw-mt-0 tw-min-h-screen">
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="tw-w-[688px] tw-bg-white tw-shadow-xl tw-rounded-xl tw-z-50"
            >
              <FormProvider {...methods}>
                <div ref={printRef}>
                  <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(handleSave)}>
                    <div className="tw-justify-between tw-flex tw-p-3xl tw-border-solid tw-border-b tw-border-[#D0D5DD] tw-border-x-0 tw-border-t-0">
                      <div className="tw-flex">
                        <div className="tw-w-1/6">
                          <Avatar
                            link={selectedUser?.profilePicture ? selectedUser?.profilePicture : ''}
                            alt={`${selectedUser?.firstName} ${selectedUser?.lastName}`}
                            firstName={selectedUser?.firstName}
                            lastName={selectedUser?.lastName}
                          />
                        </div>
                        <div className="tw-w-5/6 tw-ml-xl">
                          <div className="tw-text-lg-semibold tw-text-primary">Medical Information</div>
                          <div className="tw-text-sm-regular tw-text-tertiary">
                            {selectedUser?.firstName ? `${selectedUser.firstName} ${selectedUser.lastName}` : ''}
                          </div>
                        </div>
                      </div>
                      <span
                        className="tw-cursor-pointer noprint"
                        onClick={() => {
                          resetData();
                          setShowModal(false);
                        }}
                      >
                        <NotesCloseIcon />
                      </span>
                    </div>
                    <div className="tw-pt-2xl tw-pb-0 tw-px-3xl">
                      <div className="tw-flex tw-px-0">
                        <div className="tw-flex tw-items-center tw-space-x-md">
                          {userContacts &&
                            userContacts
                              .slice(0, userContacts.length > 3 ? 3 : userContacts.length)
                              .map((contact, index) => {
                                const contactNumber = contact?.contact?.phone;
                                return (
                                  <div className="flex items-center" key={index}>
                                    <UserCard
                                      topText={contact?.relationship}
                                      data={contact?.contact!}
                                      type={component}
                                      bottomText={
                                        contactNumber !== null && contactNumber !== 'null' && contactNumber !== '-'
                                          ? contactNumber
                                          : ''
                                      }
                                    />
                                  </div>
                                );
                              })}
                        </div>
                      </div>

                      <div className="tw-mt-2xl">
                        <div className="tw-border-solid tw-border-b tw-border-[#D0D5DD] tw-border-x-0 tw-border-t-0">
                          <Row
                            label="Severe Allergies"
                            name="severeAllergies"
                            placeholder={'Food, chemical, material, etc.'}
                            defaultValue={selectedUser?.userMedicalInformation?.severeAllergies}
                            isTagsInput={true}
                            info="Press return after each allergy."
                          />
                          <Row
                            label="Non-Severe Allergies"
                            name="nonSevereAllergies"
                            placeholder="Food, chemical , material, etc."
                            defaultValue={selectedUser?.userMedicalInformation?.nonSevereAllergies}
                            isTagsInput={true}
                            info="Press return after each allergy."
                          />
                          <Row
                            label="Food Restrictions"
                            name="foodRestrictions"
                            placeholder="Vegetarian, vegan, pork, etc."
                            defaultValue={selectedUser?.userMedicalInformation?.foodRestrictions}
                            isTagsInput={true}
                            info="Press return after each restriction."
                          />
                          <Row
                            label="Medications"
                            name="medications"
                            placeholder="Inhaler, blood thinner, etc."
                            defaultValue={selectedUser?.userMedicalInformation?.medications}
                          />
                          <Row
                            label="Medical Conditions & Impairments"
                            name="conditionAndImpairments"
                            isTextArea={true}
                            placeholder="Write a summary of conditions both internal and external."
                            defaultValue={selectedUser?.userMedicalInformation?.conditionAndImpairments}
                          />
                          <div className="tw-mb-xl"></div>
                        </div>
                        <div className="tw-mt-xl">
                          <Row
                            label="Immunizations"
                            name="immunizations"
                            placeholder="COVID-19, Flu, etc."
                            defaultValue={selectedUser?.userMedicalInformation?.immunizations}
                            isTagsInput={true}
                          />
                          <Row label="Preferred Hospital" name="preferredHospital" placeholder="Location" />
                          <Row
                            label="What to do in case of an emergency?"
                            name="inCaseOfEmergency"
                            isTextArea={true}
                            placeholder="Write a summary of who to contact and what needs to be done in the event of a medical emergency."
                            defaultValue={selectedUser?.userMedicalInformation?.inCaseOfEmergency}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="tw-px-3xl tw-pb-3xl tw-pt-4xl tw-flex tw-items-center tw-justify-between">
                      <div>
                        {!isEdit && (
                          <ReactToPrint
                            trigger={() => (
                              <button
                                className="tw-rounded-md tw-bg-white tw-border-transparent noprint tw-space-x-md"
                                type="button"
                              >
                                <div className="tw-flex tw-items-center tw-space-x-lg">
                                  <PrinterIcon />
                                  <div className="tw-text-md-semibold tw-text-tertiary hover:tw-bg-button-tertiary-fg-hover">
                                    Print
                                  </div>
                                </div>
                              </button>
                            )}
                            content={() => printRef.current}
                          />
                        )}
                      </div>
                      <div className="tw-flex tw-items-center tw-justify-center">
                        {!currentUserRoles?.isStaff && !isEdit && isEditable && (
                          <button
                            className="tw-w-[99px] tw-h-[44px] tw-rounded-md tw-px-xl tw-py-[10px] tw-gap-sm tw-shadow-sm tw-bg-brand-primary tw-border tw-border-brand tw-border-solid noprint hover:tw-bg-button-primary-hover"
                            onClick={() => setIsEdit(true)}
                            type="button"
                          >
                            <div className="tw-flex tw-space-x-sm">
                              <div>
                                <EditIcon />
                              </div>
                              <div className="tw-text-md-semibold tw-text-white">Edit</div>
                            </div>
                          </button>
                        )}
                        {isEdit && (
                          <div className="tw-space-x-lg">
                            <button
                              className="tw-h-[44px] tw-text-md-semibold tw-text-button-secondary-fg tw-rounded-md tw-px-xl tw-py-[10px] tw-shadow-sm tw-bg-white tw-border tw-border-primary tw-border-solid noprint hover:tw-bg-button-secondary-hover"
                              onClick={() => {
                                resetData();
                                setShowModal(false);
                              }}
                              type="button"
                            >
                              Cancel
                            </button>
                            <button
                              className="tw-w-[99px] tw-h-[44px] tw-rounded-md tw-px-xl tw-py-[10px] tw-gap-sm tw-shadow-sm tw-bg-brand-primary tw-border tw-border-brand tw-border-solid noprint hover:tw-bg-button-primary-hover"
                              onClick={() => {
                                if (!isEdit) setIsEdit(true);
                              }}
                              type="submit"
                            >
                              {isLoading ? (
                                <div
                                  role="status"
                                  className="tw-w-[60px] tw-h-[22px] tw-flex tw-items-center tw-justify-center"
                                >
                                  <NotesSpinner />
                                </div>
                              ) : (
                                <div className="tw-flex tw-space-x-sm">
                                  <div>
                                    <SaveIcon />
                                  </div>
                                  <div className="tw-text-md-semibold tw-text-white">Save</div>
                                </div>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </FormProvider>
            </motion.div>
          </div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
