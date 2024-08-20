import LoginLayout from '@/components/layout/LoginLayout';
import siteMetadata from '@/constants/siteMetadata';
import CommonProps from '@/models/CommonProps';
import { NextPage } from 'next';
import Head from 'next/head';
import { ArrowLeftIcon } from '@/components/svg/ArrowLeft';
import { useRouter } from 'next/router';

interface ServerErrorPageProps extends CommonProps {}

const ServerErrorPage: NextPage<ServerErrorPageProps> & {
  Layout: React.ComponentType;
} = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{`Error 500 | ${siteMetadata.title}`}</title>
      </Head>

      <div className="tw-min-h-[860px] tw-flex tw-items-center">
        <div className="container  tw-space-y-[48px]">
          <div>
            <div className="tw-text-md-semibold tw-text-brand">Error 500</div>
            <div className="tw-text-6xl tw-text-primary">{`We can't complete your request.`}</div>
            <div className="tw-text-xl-regular tw-text-tertiary">{`Oops! The Server encountered an internal error or misconfiguration and was unable to complete your request.`}</div>
          </div>
          <div>
            <div className="tw-flex tw-flex-row tw-space-x-lg">
              <button
                className="tw-py-xl tw-px-[22px] tw-space-x-10px tw-flex tw-bg-white tw-border-1 tw-border-button-secondary tw-border-solid tw-rounded-md tw-items-center hover:tw-bg-button-secondary-hover"
                onClick={() => router.back()}
              >
                <ArrowLeftIcon />
                <div className="tw-text-lg-semibold tw-text-button-secondary-fg">Go back</div>
              </button>
              <button
                className="tw-py-xl tw-px-[22px] tw-space-x-10px tw-flex tw-bg-brand tw-border-1 tw-border-button-secondary tw-border-solid tw-rounded-md tw-items-center hover:tw-bg-button-primary-hover"
                onClick={() => router.push('/account/login')}
              >
                <div className="tw-text-lg-semibold tw-text-white">Take me home</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ServerErrorPage.Layout = LoginLayout as React.ComponentType;

export default ServerErrorPage;
