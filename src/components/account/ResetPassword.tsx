import { NextPage } from 'next';
import { useRouter } from 'next/router';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';

import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import ResetPasswordModel from '@/models/ResetPasswordModel';
import ResetPasswordValidationSchema from '@/validation/ResetPasswordValidationSchema';
import { useState } from 'react';
import useCustomError from '../../hooks/useCustomError';
import CommonProps from '@/models/CommonProps';
import CustomFormError from '../common/NewCustomFormControls/CustomFormError';
import ImageBrand from '../common/ImageBrand';
import NotesSpinner from '../svg/NotesSpinner';
import CustomInput from '../common/NewCustomFormControls/CustomInput';
import CheckMarkIcon from '../svg/CheckMarkIcon';
import { CustomModal } from '../ui/CustomModal';
import Footer from '../ui/Footer';

interface ResetPasswordProps extends CommonProps {
  userId: string;
  token: string;
}

const ResetPassword: NextPage<ResetPasswordProps> = (props) => {
  const router = useRouter();

  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [showLoader, setShowLoader] = useState(false);
  const { errorMessage, setErrorMessage } = useCustomError();

  const methods = useForm<ResetPasswordModel>({
    resolver: yupResolver(ResetPasswordValidationSchema),
    defaultValues: {
      userId: props.userId,
      token: props.token,
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const submitData = async (formData: ResetPasswordModel) => {
    setShowLoader(true);
    
    formData.token = props.token;
    formData.userId = props.userId;

    unitOfService.AccountService.resetPassword(formData)
      .then((res) => {
        setShowLoader(false);

        if (res.status == 200) {
          setErrorMessage({
            message: 'Password updated successfully. Redirecting on login page...',
            show: true,
            type: 'success',
          });

          setTimeout(function () {
            router.push(`/account/login`);
          }, 2000);
        } else {
          setErrorMessage({
            message: 'Some error occured while resetting your password. Please contact system administrator',
            show: true,
            type: 'danger',
          });
        }
      })
      .catch((err) => {
        setShowLoader(false);
        setErrorMessage({
          message: 'Some error occured while resetting your password. Please contact system administrator',
          show: true,
          type: 'danger',
        });
      });
  };

  return (
    <>
      <CustomModal width={400}>
        <CustomModal.Header>
          <div className="tw-space-y-xl">
            <div className="tw-flex tw-items-center tw-justify-center">
              <ImageBrand size={32} />
            </div>
            <div className="tw-space-y-xs tw-text-center">
              <div className="tw-text-lg-semibold tw-text-primary">Password Reset</div>
              <div className="tw-text-sm-regular tw-text-tertiary">Enter your new password.</div>
            </div>
          </div>
        </CustomModal.Header>
        <CustomModal.Content>
          <FormProvider {...methods}>
            <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(submitData)} id="reset-password">
              <div className="tw-mb-xl">
                <div className="tw-mb-sm tw-text-sm-medium tw-text-secondary">Password</div>
                <CustomInput control={methods.control} name="newPassword" type="password" placeholder="●●●●●●●" />
              </div>
              <div>
                <div className="tw-mb-sm tw-text-sm-medium tw-text-secondary">Confirm Password</div>
                <CustomInput
                  control={methods.control}
                  name="confirmNewPassword"
                  type="password"
                  placeholder="●●●●●●●"
                />
              </div>
            </form>
          </FormProvider>
        </CustomModal.Content>
        <div className="tw-pt-4xl tw-px-3xl tw-space-y-lg tw-pb-3xl">
          <button
            type="submit"
            form="reset-password"
            className={`${
              errorMessage && errorMessage.type === 'success'
                ? 'tw-bg-fg-success-primary hover:tw-bg-fg-success-primary-hover'
                : 'tw-bg-button-primary hover:tw-bg-button-primary-hover'
            } tw-text-md-semibold tw-rounded-md tw-bg-button-primary tw-w-full tw-text-white tw-shadow-xs tw-px-xl tw-py-10px tw-border-0 tw-flex tw-items-center tw-justify-center tw-gap-sm tw-cursor-pointer`}
            disabled={errorMessage && errorMessage.type === 'success'}
          >
            {showLoader ? (
              <NotesSpinner />
            ) : errorMessage && errorMessage.type === 'success' ? (
              <>Successfully Changed Password {<CheckMarkIcon width={20} height={20} />}</>
            ) : (
              'Reset Password'
            )}
          </button>
        </div>
      </CustomModal>
      <Footer />
    </>
  );
};

export default ResetPassword;
