import { NextPage } from 'next';
import Link from 'next/link';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import ForgetPasswordModel from '@/models/ForgetPasswordModel';
import ForgetPasswordValidationSchema from '@/validation/ForgetPasswordValidationSchema';
import { useState } from 'react';
import useCustomError from '../../hooks/useCustomError';
import CommonProps from '@/models/CommonProps';
import ImageBrand from '@/components/common/ImageBrand';
import CustomInput from '../common/NewCustomFormControls/CustomInput';
import NotesSpinner from '../svg/NotesSpinner';
import { useRouter } from 'next/router';
import CheckMarkIcon from '../svg/CheckMarkIcon';
import CustomFormError from '../common/NewCustomFormControls/CustomFormError';
import { CustomModal } from '../ui/CustomModal';
import Footer from '../ui/Footer';

interface ForgotPasswordProps extends CommonProps {}

const ForgotPassword: NextPage<ForgotPasswordProps> = (props) => {
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [showLoader, setShowLoader] = useState(false);
  const { errorMessage, setErrorMessage } = useCustomError();
  const router = useRouter();

  const methods = useForm<ForgetPasswordModel>({
    resolver: yupResolver(ForgetPasswordValidationSchema),
    defaultValues: {
      username: ''
    }
  });

  const submitData = async (formData: ForgetPasswordModel) => {
    setShowLoader(true);

    unitOfService.AccountService.forgotPassword(formData)
      .then((res) => {
        setShowLoader(false);
        setErrorMessage({
          message: 'We have sent an email with the link to reset your password. Please check your email.',
          show: true,
          type: 'success',
        });
      })
      .catch((err) => {
        setShowLoader(false);
        setErrorMessage({
          message: err?.response?.data?.message || '',
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
              <div className="tw-text-sm-regular tw-text-tertiary">
                Enter the email associated with your account to be emailed a password reset link.
              </div>
            </div>
          </div>
        </CustomModal.Header>
        <CustomModal.Content>
          <FormProvider {...methods}>
            <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(submitData)} id="password-reset">
              <div className="tw-space-y-sm">
                <div className="tw-text-sm-medium tw-text-secondary">Email</div>
                <CustomInput
                  control={methods.control}
                  type="text"
                  name="username"
                  placeholder="Enter your school email"
                />
                {errorMessage && errorMessage.type === 'danger' && <CustomFormError error={errorMessage?.message} />}
              </div>
            </form>
          </FormProvider>
        </CustomModal.Content>
        <div className="tw-pt-4xl tw-px-3xl tw-space-y-lg tw-pb-3xl">
          <button
            type="submit"
            form="password-reset"
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
              <>Email Sent {<CheckMarkIcon width={20} height={20} />}</>
            ) : (
              'Send Reset Email'
            )}
          </button>
          <button
            type="button"
            className="tw-text-md-semibold tw-rounded-md tw-bg-white tw-w-full tw-text-button-secondary-color-fg tw-shadow-xs tw-px-xl tw-py-10px tw-border-button-secondary-color-border tw-border tw-border-solid hover:tw-bg-button-secondary-bg-hover"
            onClick={() => router.push('/account/login')}
          >
            Back to Login
          </button>
        </div>
        {/* <CustomModal.Footer
          showLoader={showLoader}
          submitText="Send Reset Email"
          hasCancel={true}
          cancelText="Back to Login"
          cancelLink="/account/login"
          formId="password-reset"
        /> */}
      </CustomModal>
      <Footer />
    </>
  );
};

export default ForgotPassword;
