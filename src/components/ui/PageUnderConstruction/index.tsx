import ArrowLeftIcon from '@/components/svg/ArrowLeft';
import { useRouter } from 'next/router';
import React from 'react';

const PageUnderConstruction = () => {
  const router = useRouter();
  
  return (
    <div className="tw-min-h-[calc(100vh-150px)] tw-flex tw-items-center">
      <div className="tw-container tw-space-y-[48px] tw-px-4xl">
        <div>
          <div className="tw-text-md-semibold tw-text-brand">404 error</div>
          <div className="tw-text-6xl tw-text-primary">Coming Soon</div>
          <div className="tw-text-xl-regular tw-text-tertiary">Sorry, the page you are looking for is still under construction.</div>
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
  );
};

export default PageUnderConstruction;
