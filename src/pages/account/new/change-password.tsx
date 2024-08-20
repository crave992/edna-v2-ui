import LoginLayout from '@/components/layout/LoginLayout';
import CommonProps from '@/models/CommonProps';
import { NextPageWithLayout } from '@/pages/_app';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import siteMetadata from '@/constants/siteMetadata';
import { CustomModal } from '@/components/ui/CustomModal';
import ImageBrand from '@/components/common/ImageBrand';
import { FormProvider, useForm } from 'react-hook-form';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import { yupResolver } from '@hookform/resolvers/yup';
import IUnitOfService from '@/services/interfaces/IUnitOfService';
import { container } from '@/config/ioc';
import { TYPES } from '@/config/types';
import useCustomError from '@/hooks/useCustomError';
import { NewAccountChangePasswordModel } from '@/models/ChangePasswordModel';
import { toast } from 'react-toastify';
import { signOut } from 'next-auth/react';
import { NewAccountChangePasswordValidationSchema } from '@/validation/ChangePasswordValidationSchema';
import { NotesSpinner } from '@/components/svg/NotesSpinner';
import Footer from '@/components/ui/Footer';
import { CheckMarkIcon } from '@/components/svg/CheckMarkIcon';

interface ChangePasswordPageProps extends CommonProps {
  userId: string;
}

const NewAccountChangePasswordPage: NextPageWithLayout<ChangePasswordPageProps> = (props) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const { errorMessage, setErrorMessage } = useCustomError();

  useEffect(() => {
    if (session && session.user && status == 'authenticated') {
      let redirectUrl = '/admin/dashboard';

      if (session.user.passwordUpdateRequiredForNewRegistration === false) {
        router.push(`${redirectUrl}`);
      }
      methods.setValue('userId', session?.user.id);
    } else {
      router.push('/account/login');
    }
  }, [status]);

  const methods = useForm<NewAccountChangePasswordModel>({
    resolver: yupResolver(NewAccountChangePasswordValidationSchema),
    defaultValues: {
      userId: session?.user.id,
      acceptTerms: false,
      confirmPassword: '',
      password: '',
    },
  });

  const submitData = async (formData: NewAccountChangePasswordModel) => {
    setShowLoader(true);
    let response = await unitOfService.AccountService.newAccountChangePassword(formData);
    if (response && response.status === 200) {
      toast.success('Password created successfully. Redirecting to login page..');
      setTimeout(async () => {
        localStorage.removeItem('at');
        localStorage.removeItem('utz');
        await signOut({ callbackUrl: '/' });
      }, 1000);
    } else {
      let error = unitOfService.ErrorHandlerService.getErrorMessage(response);
      if (error.toLowerCase() === 'incorrect password.') {
        error = 'Incorrect current password';
      }
      toast.error(error);
    }
    setShowLoader(false);
  };

  return (
    <>
      <Head>
        <title>{`Change Password | ${siteMetadata.title}`}</title>
      </Head>

      <CustomModal width={400}>
        <CustomModal.Header>
          <div className="tw-space-y-xl">
            <div className="tw-flex tw-items-center tw-justify-center">
              <ImageBrand size={32} />
            </div>
            <div className="tw-space-y-xs tw-text-center">
              <div className="tw-text-lg-semibold tw-text-primary">Change Password</div>
              <div className="tw-text-sm-regular tw-text-tertiary">
                Welcome {session?.user?.fullName}! For new user, we require to change password on first login. Thank
                you.
              </div>
            </div>
          </div>
        </CustomModal.Header>
        <CustomModal.Content>
          <FormProvider {...methods}>
            <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(submitData)} id="change-password">
              <input type="hidden" name="userId" value={session?.user.id} />
              <div className="tw-mb-xl">
                <div className="tw-mb-sm tw-text-sm-medium tw-text-secondary">Password</div>
                <CustomInput control={methods.control} name="password" type="password" placeholder="●●●●●●●" />
              </div>
              <div>
                <div className="tw-mb-sm tw-text-sm-medium tw-text-secondary">Confirm Password</div>
                <CustomInput control={methods.control} name="confirmPassword" type="password" placeholder="●●●●●●●" />
              </div>
            </form>
          </FormProvider>
        </CustomModal.Content>
        <div className="tw-pt-4xl tw-px-3xl tw-space-y-lg tw-pb-3xl">
          <button
            type="submit"
            form="change-password"
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
              'Create Profile'
            )}
          </button>
        </div>
      </CustomModal>
      <Footer />
    </>
  );
};
export default NewAccountChangePasswordPage;

NewAccountChangePasswordPage.getLayout = function getLayout(page: ReactElement) {
  return <LoginLayout>{page}</LoginLayout>;
};
