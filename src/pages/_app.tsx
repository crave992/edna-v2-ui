import 'reflect-metadata';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { ReactElement, ReactNode, useEffect, useState } from 'react';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import AdminLayout from '@/components/layout/AdminLayout';
import BreadcrumbContextProvider from '@/context/BreadcrumbContext';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/style.scss';
import '@/styles/global.css';
import '@/styles/pagination.scss';
import '@/styles/tailwind.css';

// The following import prevents a Font Awesome icon server-side rendering bug,
// where the icons flash from a very large icon down to a properly sized one:
import '@fortawesome/fontawesome-svg-core/styles.css';

// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from '@fortawesome/fontawesome-svg-core';
import { NextPage } from 'next';
config.autoAddCss = false; /* eslint-disable import/first */

import { DM_Sans } from 'next/font/google';
import { FocusProvider } from '@/context/FocusContext';
import UserProvider from '@/context/UserContext';
import { NavbarProvider } from '@/context/NavbarContext';
import Head from 'next/head';
import { AlertIcon } from '@/components/ui/AlertIcon';
import { isTablet } from 'react-device-detect';

const dmsans = DM_Sans({
  subsets: ['latin'],
  weight: '500',
  variable: '--font-dm-sans',
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
  NoLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const UnclosablePopup: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsPortrait(isPortraitMode());
    };

    const isPortraitMode = () => {
      return window.matchMedia('(orientation: portrait)').matches;
    };

    setIsPortrait(isPortraitMode());
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  useEffect(() => {
    if (isTablet && isPortrait) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [isPortrait]);

  return (
    <>
      {showPopup && (
        <>
          <div className="tw-overlay tw-fixed tw-top-0 tw-left-0 tw-w-full tw-h-screen tw-bg-black tw-bg-opacity-50 tw-z-50"></div>
          <div className="tw-popup tw-fixed tw-top-1/2 tw-left-1/2 tw-transform -tw-translate-x-1/2 -tw-translate-y-1/2 tw-bg-white p-4 tw-rounded tw-z-50">
            <div className="tw-flex tw-flex-row tw-space-x-5xl">
              <div className="tw-pt-md">
                <AlertIcon type="error" />
              </div>
              <div>Please rotate your device to landscape mode for the best experience.</div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 300000,
          },
        },
      })
  );

  if (Component.NoLayout && Component.NoLayout === true) {
    return (
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <SessionProvider session={session}>
            <Component {...pageProps} />
            <ToastContainer />
          </SessionProvider>
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </Hydrate>
      </QueryClientProvider>
    );
  }

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, , user-scalable=no, minimal-ui"
        />
      </Head>
      <SessionProvider session={session}>
        <UserProvider>
          <NavbarProvider>
            <FocusProvider>
              <ErrorBoundary>
                {Component.getLayout ? (
                  Component.getLayout(
                    <>
                      <QueryClientProvider client={queryClient}>
                        <Hydrate state={pageProps.dehydratedState}>
                          <BreadcrumbContextProvider>
                            <Component {...pageProps} />
                            <ToastContainer />
                            <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
                          </BreadcrumbContextProvider>
                        </Hydrate>
                      </QueryClientProvider>
                    </>
                  )
                ) : (
                  <QueryClientProvider client={queryClient}>
                    <Hydrate state={pageProps.dehydratedState}>
                      <BreadcrumbContextProvider>
                        <AdminLayout>
                          <Component {...pageProps} />
                          <ToastContainer />
                        </AdminLayout>
                        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
                      </BreadcrumbContextProvider>
                    </Hydrate>
                  </QueryClientProvider>
                )}
              </ErrorBoundary>
            </FocusProvider>
          </NavbarProvider>
        </UserProvider>
      </SessionProvider>
      {typeof window !== 'undefined' && <UnclosablePopup />}
    </>
  );
}
