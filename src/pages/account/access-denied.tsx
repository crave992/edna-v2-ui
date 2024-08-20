import { ArrowLeftIcon } from "@/components/svg/ArrowLeft";
import siteMetadata from "@/constants/siteMetadata";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const AccessDeniedPage: NextPage = () => {
  const router = useRouter();
  
  return (
    <>
      <Head>
        <title>{`Access Denied | ${siteMetadata.title}`}</title>
      </Head>

      <div className="tw-min-h-[860px] tw-flex tw-items-center">
        <div className="container tw-space-y-[48px]">
          <div>
            <div className="tw-text-md-semibold tw-text-brand">403 error</div>
            <div className="tw-text-6xl tw-text-primary">Access Denied</div>
            <div className="tw-text-xl-regular tw-text-tertiary">Your are not allowed to access this page.</div>
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

export default AccessDeniedPage;
