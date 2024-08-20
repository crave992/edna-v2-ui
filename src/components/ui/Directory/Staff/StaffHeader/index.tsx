import EmergencyIcon from '@/components/svg/EmergencyIcon';
import PencilIcon from '@/components/svg/PencilIcon';
import SaveIcon from '@/components/svg/SaveIcon';
import LoadingSpinner from '@/components/svg/LoadingSpinner';
import PlusIcon from '@/components/svg/PlusIcon';
import Avatar from '@/components/ui/Avatar';
import Link from 'next/link';
import HeaderSkeleton from '../../HeaderSkeleton';
import { useFocusContext } from '@/context/FocusContext';
import { UploadFileIcon } from '@/components/svg/UploadFIle';
import CustomButton from '@/components/ui/CustomButton';

interface StaffHeaderProps {
  title: string;
  subTitle: string;
  isFetchingStaff: boolean;
  selectedTab: string;
  isEditing: boolean;
  setIsEditing: Function;
  isLoading: boolean;
  setShowAddContact: Function;
  profilePicture: string;
  classAssignment: string;
  setShowEmergencyInfo: Function;
  setSelectedContact: Function;
  firstName?: string;
  lastName?: string;
  classId?: number;
  hasSeverAllergy?: boolean;
  setShowUploadFile: (showModal: boolean) => void;
  staffId:number;
}

const StaffHeader = ({
  title,
  subTitle,
  isFetchingStaff,
  selectedTab,
  isEditing,
  setIsEditing,
  isLoading,
  setShowAddContact,
  profilePicture,
  classAssignment,
  setShowEmergencyInfo,
  setSelectedContact,
  firstName,
  lastName,
  classId,
  hasSeverAllergy = false,
  setShowUploadFile,
  staffId
}: StaffHeaderProps) => {
  const handleAddContact = () => {
    setIsEditing(false);
    setSelectedContact(undefined);
    setShowAddContact(true);
  };
  const { currentUserRoles } = useFocusContext();

  return (
    <div className="tw-py-xl tw-min-w-[1016px] tw-mx-4xl  tw-flex tw-items-center tw-justify-between">
      {isFetchingStaff ? (
        <HeaderSkeleton />
      ) : (
        <>
          <div className="tw-flex tw-space-x-xl">
            <div>
              <Avatar link={profilePicture} photoSize={56} firstName={firstName} lastName={lastName} />
            </div>
            <div>
              <div className="tw-text-lg tw-font-semibold tw-text-color-primary">{title}</div>
              <div className="tw-text-sm tw-font-normal tw-text-color-tertiary">
                {subTitle}
                <span>
                  {classAssignment !== '' && ','}
                  <Link
                    href={currentUserRoles?.hasAdminRoles ? `/directory/class/${classId}` : `/focus/class`}
                    className="tw-underline tw-text-sm-regular tw-text-tertiary tw-ml-sm hover:tw-text-primary hover:tw-text-sm-medium"
                  >
                    <span className="tw-underline">{classAssignment}</span>
                  </Link>
                </span>
              </div>
            </div>
          </div>
          <div className="tw-flex tw-items-center tw-justify-between tw-gap-x-3">
            <div>
              <button
                className={
                  'tw-h-[40px] tw-space-x-xs tw-text-sm-semibold tw-flex tw-items-center tw-justify-center tw-py-10px tw-px-14px tw-bg-transparent tw-text-button-secondary tw-rounded-md tw-border tw-border-secondary tw-border-solid tw-shadow-sm hover:tw-bg-button-secondary-hover'
                }
                onClick={() => setShowEmergencyInfo(true)}
              >
                <EmergencyIcon color={hasSeverAllergy ? 'error' : 'gray'} />
                <span className={'tw-pl-1'}>Medical</span>
              </button>
            </div>
            {((!currentUserRoles?.isStaff && currentUserRoles?.hasSuperAdminRoles) || (staffId == currentUserRoles?.staffId)) && (
                <>
                {selectedTab === 'Profile' && !isEditing &&(
                  <div>
                    <button
                      className={
                        'tw-h-[40px] tw-font-semibold tw-text-sm tw-flex tw-items-center tw-justify-center tw-py-2.5 tw-px-3.5 tw-bg-brand-primary tw-text-white tw-rounded-md tw-border tw-border-brand tw-border-solid tw-shadow-sm hover:tw-bg-button-primary-hover'
                      }
                      onClick={() => setIsEditing(true)}
                    >
                      <PencilIcon stroke={'white'} /> <span className={'tw-pl-1'}>Edit</span>
                    </button>
                  </div>
                )}
                {selectedTab === 'Profile' && isEditing && (
                  <div>
                    <button
                      className={
                        'tw-h-[40px] tw-font-semibold tw-text-sm tw-flex tw-items-center tw-justify-center tw-py-2.5 tw-px-3.5 tw-bg-white tw-text-[#00466E] tw-rounded-md tw-border tw-border-[#7097B8] tw-border-solid tw-shadow-sm hover:tw-bg-button-secondary-bg-hover'
                      }
                      onClick={() => setIsEditing(false)}
                    >
                      <span>Cancel</span>
                    </button>
                  </div>
                )}

                {selectedTab === 'Profile' && isEditing && (
                  <div>
                    <button
                      className={
                        'tw-h-[40px] tw-font-semibold tw-text-sm tw-flex tw-items-center tw-justify-center tw-py-2.5 tw-px-3.5 tw-bg-brand-primary tw-text-white tw-rounded-md tw-border tw-border-brand tw-border-solid tw-shadow-sm hover:tw-bg-button-primary-hover'
                      }
                      type="submit"
                      form="update-staff"
                    >
                      {isLoading ? (
                        <div role="status">
                          <LoadingSpinner width={25} />
                        </div>
                      ) : (
                        <>
                          <SaveIcon stroke={'white'} /> <span className={'tw-pl-1'}>Save</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {selectedTab === 'Files' && (
                  <CustomButton
                    text="Upload File"
                    btnSize="md"
                    heirarchy="primary"
                    onClick={() => setShowUploadFile(true)}
                    iconLeading={<UploadFileIcon color="white" />}
                  />
                )}

                {selectedTab === 'Contacts' && (
                  <div>
                    <button
                      className={
                        'tw-h-[40px] tw-font-semibold tw-text-sm tw-flex tw-items-center tw-justify-center tw-py-2.5 tw-px-3.5 tw-bg-brand-primary tw-text-white tw-rounded-md tw-border tw-border-brand tw-border-solid tw-shadow-sm hover:tw-bg-button-primary-hover'
                      }
                      onClick={() => handleAddContact()}
                    >
                      <PlusIcon stroke={'white'} /> <span className={'tw-pl-1'}>Add Contact</span>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default StaffHeader;
