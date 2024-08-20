import { useState, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotesCloseIcon from '@/components/svg/NotesCloseIcon';
import NotesSpinner from '@/components/svg/NotesSpinner';
import SaveIcon from '@/components/svg/SaveIcon';
import { useQueryClient } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import StaffModel from '@/models/StaffModel';
import { useForm, FormProvider } from 'react-hook-form';
import * as Yup from 'yup';
import CustomDatePicker from '@/components/common/CustomDatePicker';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import CustomDropdown from '@/components/common/NewCustomFormControls/CustomDropdown';
import { addStaff } from '@/services/api/addStaff';
import { useSalaryTypesQuery } from '@/hooks/queries/useSalaryQuery';
import { useSystemUserRolesQuery } from '@/hooks/queries/useRolesQuery';
import { useJobTitlesQuery } from '@/hooks/queries/useJobsQuery';

interface AddStaffProps {
  showModal?: boolean;
  setShowModal: Function;
  component: string;
}

interface SaveData {
  id: number;
  userName: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  jobTitleId: number;
  systemRole: string;
  salaryTypeId: number;
  profileImage: File | null;
  salaryAmount: number;
  empStartDate: Date | null;
  phoneNumber: string;
}

const schema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  jobTitleId: Yup.number().required('Job title is required'),
  systemRole: Yup.string().required('Role is required'),
  salaryTypeId: Yup.number().required('Salary type is required'),
  email: Yup.string()
    .required('Email is required')
    .matches(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/, 'Invalid email'),
  salaryAmount: Yup.string()
    .required('Salary is required')
    .matches(/^\d+\.?\d{0,2}$/, 'Invalid amount'),
  profileImage: Yup.mixed()
    .test('sholdNotMoreThan1Mb', 'Maximum 1mb file allowed', (value, context) => {
      const files = value as unknown as FileList;
      var result = true;
      if (files && files.length > 0) {
        const MAX_ALLOWED_FILE_SIZE = 1024 * 1024; // 1 MB
        const fileSizeInByte = files[0].size;

        result = fileSizeInByte <= MAX_ALLOWED_FILE_SIZE;
      }
      return result;
    })
    .test('onlyImageFileAllowed', 'Only image file format allowed', (value, context) => {
      const files = value as unknown as FileList;
      var result = true;
      if (files && files.length > 0) {
        const fileType = files[0].type;
        result = fileType.startsWith('image/');
      }
      return result;
    }),
  phoneNumber: Yup.string()
    .required('Phone is required')
    .matches(/^[0-9-]+$/, 'Invalid phone number. Only numbers and dashes are allowed'),
});

export default function AddStaff({ showModal, setShowModal, component }: AddStaffProps) {
  const [empStartDate, setEmpStartDate] = useState<Date | null>(null);
  const [selectedRole, setSelectedRole] = useState<{ id: number; name: string } | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<{ id: number; name: string } | null>(null);
  const [selectedSalaryType, setSelectedSalaryType] = useState<{ id: number; name: string } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const methods = useForm<StaffModel>({
    resolver: yupResolver(schema),
  });

  const { data: salaryTypes } = useSalaryTypesQuery();
  const { data: userRoles } = useSystemUserRolesQuery();
  const { data: jobTitles } = useJobTitlesQuery();

  useEffect(() => {
    const body = document.querySelector('body');

    if (showModal) {
      body && body.classList.add('body-scroll-lock');
    } else {
      body && body.classList.remove('body-scroll-lock');
    }

    return () => {
      body && body.classList.remove('body-scroll-lock');
    };
  }, [showModal]);

  const resetData = () => {
    setEmpStartDate(null);
    setSelectedRole(null);
    setSelectedTitle(null);
    setSelectedSalaryType(null);
    methods.reset();
  };

  const handleSuccess = () => {
    resetData();
    setIsLoading(false);
    queryClient.invalidateQueries(['staffs-directory']);
    setShowModal(false);
  };

  const handleSave = async (data: StaffModel) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof SaveData];
      if (key === 'profileImage') {
        formData.append(key, data?.[key][0] as File);
      } else {
        if (key === 'email') {
          formData.append('userName', value as string);
          formData.append('title', '.');
        }
        formData.append(key, value as string);
      }
    });

    setIsLoading(true);

    addStaff(formData).then(() => {
      handleSuccess();
    });
  };

  const handlePickDate = (date: Date | null) => {
    setEmpStartDate(date);
    methods.setValue('empStartDate', date);
  };

  const handleClose = () => {
    resetData();
    setShowModal(false);
  };

  return (
    <AnimatePresence>
      {showModal ? (
        <>
          <div className="tw-p-3xl tw-fixed tw-top-0 tw-left-0 tw-w-screen tw-flex tw-items-start tw-justify-center tw-overflow-y-scroll tw-max-h-screen tw-bg-black/[0.3] tw-z-20">
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="tw-p-3xl tw-w-[480px] tw-bg-white tw-shadow-xl tw-rounded-xl tw-z-50 custom-thin-scrollbar"
            >
              <FormProvider {...methods}>
                <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(handleSave)}>
                  <div className="tw-justify-between tw-flex tw-mb-5">
                    <div className="tw-font-black tw-text-lg">Add {component}</div>
                    <span className="tw-cursor-pointer" onClick={() => handleClose()}>
                      <NotesCloseIcon />
                    </span>
                  </div>

                  <div>
                    <div className="tw-mb-4">
                      <div className="tw-text-sm tw-text-secondary tw-font-medium tw-mb-1.5">Name</div>
                      <div className="tw-flex tw-w-full tw-gap-x-3">
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

                    <div className="tw-mb-4">
                      <CustomInput
                        control={methods.control}
                        type="file"
                        name="profileImage"
                        label="profile image"
                        containerClassName="tw-flex-1"
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

                    <div className="tw-mb-4">
                      <div className="tw-text-sm tw-text-secondary tw-font-medium tw-mb-1.5">Role & Title</div>
                      <div className="tw-flex tw-w-full tw-gap-x-3">
                        <CustomDropdown
                          selectedItems={selectedRole}
                          setSelectedItems={setSelectedRole}
                          data={userRoles}
                          component="Role"
                          control={methods.control}
                          name="systemRole"
                        />
                        <CustomDropdown
                          selectedItems={selectedTitle}
                          setSelectedItems={setSelectedTitle}
                          data={jobTitles}
                          component="Job Title"
                          control={methods.control}
                          name="jobTitleId"
                        />
                      </div>
                    </div>

                    <div className="tw-mb-4">
                      <div className="tw-text-sm tw-text-secondary tw-font-medium tw-mb-1.5">Compensation</div>
                      <div className="tw-flex tw-w-full tw-gap-x-3">
                        <CustomInput
                          control={methods.control}
                          type="text"
                          name="salaryAmount"
                          placeholder="Amount"
                          containerClassName="tw-flex-1"
                        />
                        <CustomDropdown
                          selectedItems={selectedSalaryType}
                          setSelectedItems={setSelectedSalaryType}
                          data={salaryTypes}
                          component="Salary Type"
                          control={methods.control}
                          name="salaryTypeId"
                        />
                      </div>
                    </div>

                    <div className="tw-mb-4">
                      <div className="tw-text-sm tw-text-secondary tw-font-medium tw-mb-1.5">Start Date</div>
                      <CustomDatePicker
                        name="empStartDate"
                        selected={empStartDate}
                        onChange={(date: Date | null) => handlePickDate(date)}
                      />
                    </div>

                    <div className="tw-mb-4">
                      <div className="tw-text-sm tw-text-secondary tw-font-medium tw-mb-1.5">Email</div>
                      <CustomInput
                        control={methods.control}
                        type="email"
                        name="email"
                        placeholder="info@myedna.net"
                        containerClassName="tw-flex-1"
                      />
                    </div>

                    <div className="tw-mb-4">
                      <div className="tw-text-sm tw-text-secondary tw-font-medium tw-mb-1.5">Phone</div>
                      <CustomInput
                        control={methods.control}
                        type="phone"
                        name="phoneNumber"
                        placeholder="XXX-XXX-XXXX"
                        containerClassName="tw-flex-1"
                        icon="phoneNumber"
                      />
                    </div>

                    <div className="tw-mb-4">
                      <div className="tw-text-sm tw-text-secondary tw-font-medium tw-mb-1.5">Description</div>
                      <textarea
                        rows={4}
                        className="tw-h-[154px] tw-block tw-py-2.5 tw-px-3.5 tw-w-full tw-text-sm tw-text-placeholder-900 tw-bg-white tw-rounded-md tw-border tw-border-primary tw-resize-none"
                        placeholder="Write a brief description of this staff member. Why they joined, what they did for work, and what they want to get out of the role."
                        {...methods.register('description')}
                      />
                    </div>
                  </div>
                  <div className="tw-pt-0 tw-mt-8 tw-flex tw-items-center tw-justify-between">
                    <div></div>
                    <div className="tw-flex tw-items-center tw-justify-center">
                      <button
                        className="tw-font-semibold tw-rounded-md tw-px-3.5 tw-py-2.5 tw-mr-3 tw-shadow-sm tw-bg-white tw-text-secondary tw-border tw-border-primary tw-border-solid"
                        onClick={() => handleClose()}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="tw-font-semibold tw-rounded-md tw-px-3.5 tw-py-2.5 tw-shadow-sm tw-bg-brand-primary tw-text-white tw-border tw-border-brand tw-border-solid"
                        type="submit"
                      >
                        {isLoading ? (
                          <div role="status">
                            <NotesSpinner />
                          </div>
                        ) : (
                          <>
                            <span className="tw-mr-1.5">
                              <SaveIcon />
                            </span>
                            Save
                          </>
                        )}
                      </button>
                    </div>
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
