import EmergencyIcon from '@/components/svg/EmergencyIcon';
import PencilIcon from '@/components/svg/PencilIcon';
import SaveIcon from '@/components/svg/SaveIcon';
import LoadingSpinner from '@/components/svg/LoadingSpinner';
import PlusIcon from '@/components/svg/PlusIcon';
import Avatar from '@/components/ui/Avatar';
import HeaderSkeleton from '@/components/ui/Directory/HeaderSkeleton';
import Link from 'next/link';
import UploadFileIcon from '@/components/svg/UploadFIle';
import { useFocusContext } from '@/context/FocusContext';
import ClassAssignmentDto from '@/dtos/ClassAssignmentDto';
import { useClassesQuery } from '@/hooks/queries/useClassesQuery';
import { useEffect, useState } from 'react';
import UserContactMapModel from '@/models/UserContactModel';
import { useSession } from 'next-auth/react';

interface ProfileHeaderProps {
  classData?: ClassAssignmentDto[];
  isFetchingStudent: boolean;
  photoLink: string;
  title: string;
  subTitle: string;
  selectedTab: string;
  isEditing: boolean;
  setIsEditing: Function;
  isLoading: boolean;
  setShowAddContact: Function;
  setShowUploadFile: (showModal: boolean) => void;
  setShowEmergency: (showModal: boolean) => void;
  setShowAddAttendance: (showModal: boolean) => void;
  formId: string;
  firstName?: string;
  lastName?: string;
  hasSeverAllergy?: boolean;
  studentContacts?:UserContactMapModel[];
}

const Header = ({
  classData,
  isFetchingStudent,
  photoLink,
  title,
  subTitle,
  selectedTab,
  isEditing,
  setIsEditing,
  isLoading,
  setShowAddContact,
  setShowUploadFile,
  setShowEmergency,
  setShowAddAttendance,
  formId,
  firstName,
  lastName,
  hasSeverAllergy = false,
  studentContacts
}: ProfileHeaderProps) => {
  const { setClassId, setLevelId } = useFocusContext();
  const { currentUserRoles} = useFocusContext();
  const subtitleParts = subTitle.split(',');
  const tabsToExclude = ['Contacts', 'Attendance', 'Forms', 'Files', 'Milestones'];
  const [canEditStudent, setCanEditStudent] = useState<boolean>(false);
  const { data: session } = useSession();
  const { data: staffClasses } = useClassesQuery({
    isAdmin:
      currentUserRoles?.hasSuperAdminRoles || currentUserRoles?.hasAccountOwnerRoles || currentUserRoles?.hasAdminRoles,
    staffId: currentUserRoles?.staffId!,
  });
  
  useEffect(() => {
    if (staffClasses && staffClasses.length > 0) {
        var editstudent = false;

        if(currentUserRoles?.hasAdminRoles) {
          editstudent = true;
        } else {
          
          for(let staffClass of staffClasses){
            let studentClassData = classData?.find((cData: { classId: any; }) => {
              return cData.classId == staffClass?.id;
            });

            if(studentClassData){
              var classStaffList = staffClass?.classStaff;
              var currentstaff = classStaffList.find((staff: { id: number | null | undefined; }) => {
                return staff.id == currentUserRoles?.staffId
              });

              if(currentstaff != null){
                editstudent = currentstaff.type == 1; //current staff is a lead guide to the current student's class.
                break;
              }
            }

          }
        }
        setCanEditStudent(editstudent);
    } else if(currentUserRoles?.isParent){
      var parentContact = studentContacts?.find((contact:UserContactMapModel) => {
        return contact?.contact?.email == session?.user?.userName;
      });
      setCanEditStudent(parentContact != null);
    }
  }, [staffClasses, classData]);


  const handleCancel = () => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (form) {
      form.reset();
    }
    setIsEditing(false);
  };

  return (
    <div className="tw-py-xl tw-min-w-[1016px] tw-mx-4xl  tw-flex tw-items-center tw-justify-between">
      {isFetchingStudent ? (
        <HeaderSkeleton />
      ) : (
        <>
          <div className="tw-flex tw-flex-row tw-space-x-xl">
            <Avatar link={photoLink || ''} photoSize={56} firstName={firstName} lastName={lastName} />
            <div>
              <div className="tw-text-lg-semibold">{title}</div>
              <div className="tw-flex tw-text-sm-regular tw-text-tertiary">
                {subtitleParts[0]}
                {classData && classData.length > 0 && (
                  <>
                    {`, `}
                    {classData.map((item, index) => {
                      const linkHref = currentUserRoles?.hasAdminRoles
                        ? `/directory/class/${item.classId}`
                        : `/focus/class`;

                      return (
                        <div key={item.id}>
                          {index > 0 ? ', ' : ''}
                          <Link
                            href={linkHref}
                            className={`${
                              currentUserRoles?.isParent
                                ? 'tw-pointer-events-none tw-no-underline'
                                : 'tw-underline hover:tw-text-primary hover:tw-text-sm-medium'
                            } tw-text-sm-regular tw-text-tertiary tw-ml-sm `}
                            onClick={() => {
                              if (!currentUserRoles?.isParent) {
                                setClassId(item.classId);
                                setLevelId(item.levelId);
                              }
                            }}
                            aria-disabled={currentUserRoles?.isParent}
                            tabIndex={currentUserRoles?.isParent ? -1 : undefined}
                          >
                            {item.className}
                          </Link>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className={'tw-flex tw-items-center tw-justify-between tw-gap-x-3'}>
            <div>
              <button
                className="tw-h-[40px] tw-space-x-xs tw-text-sm-semibold tw-flex tw-items-center tw-justify-center tw-py-10px tw-px-14px tw-bg-transparent tw-text-button-secondary tw-rounded-md tw-border tw-border-secondary tw-border-solid tw-shadow-sm hover:tw-bg-button-secondary-hover"
                onClick={() => setShowEmergency(true)}
              >
                <EmergencyIcon color={hasSeverAllergy ? 'error' : 'gray'} />
                <div>Medical</div>
              </button>
            </div>

            {isEditing && !tabsToExclude.some((tab) => tab === selectedTab) && (
              <>
                <div>
                  <button
                    className="tw-h-[40px] tw-text-sm-semibold tw-flex tw-items-center tw-justify-center tw-py-10px tw-px-14px tw-bg-white tw-text-button-secondary-color-fg tw-rounded-md tw-border tw-border-brand tw-border-solid tw-shadow-sm hover:tw-bg-button-secondary-bg-hover"
                    onClick={handleCancel}
                  >
                    <span>Cancel</span>
                  </button>
                </div>
                <div>
                  <button
                    className="tw-h-[40px] tw-w-[88px] tw-space-x-xs tw-text-sm-semibold tw-flex tw-items-center tw-justify-center tw-py-10px tw-px-14px tw-bg-brand tw-text-white tw-rounded-md tw-border tw-border-brand tw-border-solid tw-shadow-sm hover:tw-bg-button-primary-hover"
                    type="submit"
                    form={formId}
                  >
                    {isLoading ? (
                      <div role="status">
                        <LoadingSpinner width={25} />
                      </div>
                    ) : (
                      <>
                        <SaveIcon stroke={'white'} />
                        <div>Save</div>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {(currentUserRoles?.hasAdminRoles || canEditStudent) &&
              !isEditing &&
              !tabsToExclude.some((tab) => tab === selectedTab) && (
                <div>
                  <button
                    className="tw-h-[40px] tw-space-x-xs tw-text-sm-semibold tw-flex tw-items-center tw-justify-center tw-py-10px tw-px-14px tw-bg-brand-primary tw-text-white tw-rounded-md tw-border-transparent tw-shadow-sm hover:tw-bg-button-primary-hover"
                    onClick={() => setIsEditing(true)}
                  >
                    <PencilIcon stroke={'white'} />
                    <div>Edit</div>
                  </button>
                </div>
              )}

            {selectedTab === 'Contacts' && (currentUserRoles?.hasAdminRoles || currentUserRoles?.isParent) && (
              <div>
                <button
                  className="tw-h-[40px] tw-space-x-xs tw-text-sm-semibold tw-flex tw-items-center tw-justify-center tw-py-10px tw-px-14px tw-bg-brand tw-text-white tw-rounded-md tw-border tw-border-brand tw-border-solid tw-shadow-sm hover:tw-bg-button-primary-hover"
                  onClick={() => setShowAddContact(true)}
                >
                  <PlusIcon stroke={'white'} />
                  <div>Add Contact</div>
                </button>
              </div>
            )}

            {selectedTab === 'Files' && (
              <div>
                <button
                  className="tw-h-[40px] tw-space-x-xs tw-text-sm-semibold tw-flex tw-items-center tw-justify-center tw-py-10px tw-px-14px tw-bg-brand tw-text-white tw-rounded-md tw-border tw-border-brand tw-border-solid tw-shadow-sm hover:tw-bg-button-primary-hover"
                  onClick={() => setShowUploadFile(true)}
                >
                  <UploadFileIcon color="white" />
                  <div>Upload File</div>
                </button>
              </div>
            )}

            {selectedTab === 'Attendance' && !currentUserRoles?.isParent && (
              <div>
                <button
                  className="tw-h-[40px] tw-space-x-xs tw-text-sm-semibold tw-flex tw-items-center tw-justify-center tw-py-10px tw-px-14px tw-bg-brand tw-text-white tw-rounded-md tw-border tw-border-brand tw-border-solid tw-shadow-sm hover:tw-bg-button-primary-hover"
                  onClick={() => setShowAddAttendance(true)}
                >
                  <PlusIcon stroke="white" />
                  <div>Add Attendance</div>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Header;