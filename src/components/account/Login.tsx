import { NextPage } from 'next';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import siteMetadata from '@/constants/siteMetadata';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FormProvider } from 'react-hook-form';
import LoginModel from '@/models/LoginModel';
import LoginValidationSchema from '@/validation/LoginValidationSchema';
import { useState } from 'react';
import CommonProps from '@/models/CommonProps';
import ImageBrand from '@/components/common/ImageBrand';
import CustomInput from '@/components/common/NewCustomFormControls/CustomInput';
import CustomCheckboxButton from '@/components/common/NewCustomFormControls/CustomCheckboxButton';
import Footer from '@/components/ui/Footer';
import { CustomModal } from '@/components/ui/CustomModal';
import Alert from '@/components/ui/Alert';
import { AlertCircleIcon } from '@/components/svg/AlertCircle';

interface LoginProps extends CommonProps {}

const Login: NextPage<LoginProps> = (props) => {
  const [showLoader, setShowLoader] = useState(false);
  const [showError, setShowError] = useState<boolean>(false);

  const methods = useForm<LoginModel>({
    resolver: yupResolver(LoginValidationSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  const submitData = async (formData: LoginModel) => {
    setShowLoader(true);

    try {
      const loginStatus = await signIn('credentials', {
        redirect: false,
        username: formData.username,
        password: formData.password,
        rememberMe: formData.rememberMe,
        callbackUrl: '/',
      });

      if (!loginStatus?.ok) {
        setShowError(true);
      }
    } catch (error) {
      setShowError(true);
    } finally {
      setShowLoader(false);
    }
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
              <div className="tw-text-lg-semibold tw-text-primary">{siteMetadata.title} Login</div>
              <div className="tw-text-sm-regular tw-text-tertiary">Welcome back! Please enter your details.</div>
            </div>
          </div>
        </CustomModal.Header>
        <CustomModal.Content>
          <FormProvider {...methods}>
            <form method="post" autoComplete="off" onSubmit={methods.handleSubmit(submitData)} id="login">
              <div className="tw-space-y-2xl">
                <div className="tw-space-y-xl">
                  <div className="tw-space-y-sm">
                    <div className="tw-text-sm-medium tw-text-secondary">Email</div>
                    <CustomInput
                      control={methods.control}
                      type="text"
                      name="username"
                      placeholder="Enter your school email"
                    />
                  </div>
                  <div className="tw-space-y-sm">
                    <div className="tw-text-sm-medium tw-text-secondary">Password</div>
                    <CustomInput
                      control={methods.control}
                      name="password"
                      type="password"
                      placeholder="•••••••"
                      inputClassName="placeholder:tw-text-placeholder placeholder:tw-text-md-regular"
                    />
                  </div>
                </div>

                <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-p-0">
                  <CustomCheckboxButton
                    control={methods.control}
                    name="rememberMe"
                    label="Remember for 30 Days"
                    defaultValue={false}
                    containerClass="tw-border-0 !tw-ring-0 !tw-p-0 tw-text-sm-medium tw-text-secondary tw-select-none"
                  />
                  <Link
                    href="/account/forgot-password"
                    className="tw-text-sm-semibold hover:tw-text-button-tertiary-fg tw-text-button-tertiary-fg tw-no-underline"
                  >
                    Forgot Password
                  </Link>
                </div>
                {showError && (
                  <Alert
                    type="error"
                    icon={<AlertCircleIcon color="error" />}
                    errorText="Invalid email or password"
                    onClose={() => setShowError(false)}
                  />
                )}
              </div>
            </form>
          </FormProvider>
        </CustomModal.Content>
        <CustomModal.Footer
          showLoader={showLoader}
          submitText="Sign in"
          formId="login"
          onClick={() => setShowError(false)}
        />
      </CustomModal>
      <Footer />
    </>
  );
};

export default Login;
