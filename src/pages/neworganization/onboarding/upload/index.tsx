import CheckCircleIcon from '@/components/svg/CheckCircle';
import CloseIcon from '@/components/svg/CloseIcon';
import CustomButton from '@/components/ui/CustomButton';
import UncontrolledDropdown from '@/components/ui/Uncontrolled/UncontrolledDropdown';
import siteMetadata from '@/constants/siteMetadata';
import { useFocusContext } from '@/context/FocusContext';
import { OrganizationDto } from '@/dtos/OrganizationDto';
import { useOrganizationsQuery } from '@/hooks/queries/useOrganizationQuery';
import useNotification from '@/hooks/useNotification';
import AccessDenied from '@/pages/account/access-denied';
import { uploadOnboardingFile } from '@/services/api/uploadFile';
import Head from 'next/head';
import { useMutation } from '@tanstack/react-query';
import React, { useState, ChangeEvent } from 'react';
import { sendOnboardingEmail } from '@/services/api/newOnboarding';

const OnboardingUpload = () => {
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const { currentUserRoles } = useFocusContext();
  const notify = useNotification;
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: organizations } = useOrganizationsQuery();

  const uploadFileMutation = useMutation(
    async ({ data }: { data: FormData }) => {
      return await uploadOnboardingFile(data);
    },
    {
      onSuccess: (data, variables) => {
        if (data.status) {
          notify(data.message, <CheckCircleIcon />);
        } else {
          notify(data.message, <CloseIcon />);
        }
      },
      onError: (error) => {
        console.error('Error uploading image:', error);
      },
    }
  );

  const sendonboardingemailMutation = useMutation(
    async ({ id }: { id: number }) => {
      return await sendOnboardingEmail(id);
    },
    {
      onSuccess: (data, variables) => {
        notify('Onboarding email sent to all Guardians', <CheckCircleIcon />);
      },
      onError: (error) => {
        console.error('Error uploading image:', error);
      },
    }
  );

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleSelectOrg = (selectedOrg: OrganizationDto) => {
    setSelectedId(selectedOrg.id);
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    if (!fileToUpload) return;

    const formData = new FormData();
    formData.append('file', fileToUpload);
    uploadFileMutation.mutateAsync({ data: formData });
  };

  const sendOnboardingEmailTrigger = async () => {
    await sendonboardingemailMutation.mutateAsync({ id: selectedId! });
  };

  const mappedOrganizations = organizations?.map((org: OrganizationDto) => ({
    ...org,
    name: org.schoolName,
  }));

  return (
    <>
      <Head>
        <title>{`School Onboarding | ${siteMetadata.title}`}</title>
      </Head>
      {!currentUserRoles?.IsNooranaAdmin ? (
        <AccessDenied />
      ) : (
        <div className="tw-mx-4xl tw-py-3xl tw-space-y-5xl tw-h-[calc(100vh-200px)]">
          <form onSubmit={handleSave}>
            <div className="tw-text-lg-semibold tw-text-primary">School Onboarding via Spreadsheet Upload</div>
            <div className="tw-flex tw-space-x-md tw-items-center tw-mt-md">
              <div className="tw-flex tw-items-center">
                <input type="file" onChange={handleFileChange} />
              </div>
              <CustomButton type="submit" text="Upload" btnSize="sm" heirarchy="primary" className="!tw-w-auto" />
            </div>
          </form>
          <div className="">
            <div className="tw-text-lg-semibold tw-text-primary">Send Onboarding Email to all Guardians</div>
            <div className="tw-flex tw-space-x-md tw-items-center tw-mt-md">
              <UncontrolledDropdown
                data={mappedOrganizations ?? []}
                component="Organizations"
                selectedItems={
                  selectedId
                    ? mappedOrganizations?.find((org: OrganizationDto) => org.id === selectedId)
                    : mappedOrganizations?.[0]
                }
                dropdownClassName="!tw-bg-secondary !tw-space-y-lg"
                anchorRight={false}
                setSelectedItems={handleSelectOrg}
              />
              <CustomButton
                type="button"
                text="Send"
                btnSize="sm"
                heirarchy="primary"
                className="!tw-w-auto"
                onClick={sendOnboardingEmailTrigger}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OnboardingUpload;
