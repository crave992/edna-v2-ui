import PencilIcon from '@/components/svg/PencilIcon';
import SaveIcon from '@/components/svg/SaveIcon';
import LoadingSpinner from '@/components/svg/LoadingSpinner';
import Avatar from '@/components/ui/Avatar';
import HeaderSkeleton from '@/components/ui/Directory/HeaderSkeleton';
import Link from 'next/link';
import { StudentBasicDto } from '@/dtos/StudentDto';
import CustomButton from '@/components/ui/CustomButton';
import { useFocusContext } from '@/context/FocusContext';
import { useSession } from 'next-auth/react';
import { useParentQuery } from '@/hooks/queries/useParentQuery';

interface ProfileHeaderProps {
  childData?: StudentBasicDto[];
  isFetchingParent: boolean;
  photoLink: string;
  title: string;
  subTitle: string;
  selectedTab: string;
  isEditing: boolean;
  setIsEditing: Function;
  isLoading: boolean;
  formId: string;
  firstName?: string;
  lastName?: string;
}

const Header = ({
  childData,
  isFetchingParent,
  photoLink,
  title,
  subTitle,
  selectedTab,
  isEditing,
  setIsEditing,
  isLoading,
  formId,
  firstName,
  lastName,
}: ProfileHeaderProps) => {
  const subtitleParts = subTitle.split(',');
  const tabsToExclude = ['Contacts', 'Attendance', 'Forms'];
  const { currentUserRoles } = useFocusContext();
  const { data: session } = useSession();
  const studentAssignmentIds = session?.user.studentAssignmentIds ?? [];

  const { data: parentInfo } = useParentQuery(currentUserRoles?.isParent!);

  const handleCancel = () => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (form) {
      form.reset();
    }
    setIsEditing(false);
  };

  return (
    <div className="tw-py-xl tw-min-w-[1016px] tw-mx-4xl tw-flex tw-items-center tw-justify-between">
      {isFetchingParent ? (
        <HeaderSkeleton />
      ) : (
        <>
          <div className="tw-flex tw-flex-row tw-space-x-xl">
            <div>
              <Avatar link={photoLink} photoSize={56} firstName={firstName} lastName={lastName} />
            </div>
            <div>
              <div className="tw-text-lg-semibold">{title}</div>
              <div className="tw-flex tw-flex-wrap tw-text-sm-regular tw-text-tertiary">
                {subtitleParts[0]}
                {childData &&
                  childData.length > 0 &&
                  childData.map((item, index) => (
                    <div key={item.id}>
                      {currentUserRoles?.hasAdminRoles || studentAssignmentIds.indexOf(item?.id) > -1 ? (
                        <Link
                          href={
                            currentUserRoles?.isParent
                              ? `/parent/my-children/${item.id}`
                              : `/directory/student/${item.id}`
                          }
                          className="tw-underline tw-text-sm-regular tw-text-tertiary tw-ml-sm first:tw-ml-0 hover:tw-text-primary hover:tw-text-sm-medium"
                        >
                          {`${item.firstName} ${item.nickName ? `(${item.nickName})` : ''} ${item.lastName}`}
                        </Link>
                      ) : (
                        `${item.firstName} ${item.nickName ? `(${item.nickName})` : ''} ${item.lastName}`
                      )}

                      {index < childData.length - 1 && <span style={{ whiteSpace: 'pre' }}>, </span>}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div className={'tw-flex tw-items-center tw-justify-between tw-space-x-lg'}>
            {isEditing && !tabsToExclude.some((tab) => tab === selectedTab) && (
              <>
                <div>
                  <button
                    className={
                      'tw-h-[40px] tw-flex tw-items-center tw-justify-center tw-py-10px tw-px-14px tw-bg-white tw-text-sm-semibold tw-text-brand tw-rounded-md tw-border tw-border-brand tw-border-solid tw-shadow-sm hover:tw-bg-button-secondary-bg-hover'
                    }
                    onClick={handleCancel}
                  >
                    <span>Cancel</span>
                  </button>
                </div>
                <div>
                  <button
                    className={
                      'tw-h-[40px] tw-w-[88px] tw-space-x-xs tw-text-sm-semibold tw-flex tw-items-center tw-justify-center tw-py-10px tw-px-14px tw-bg-brand tw-text-white tw-rounded-md tw-border tw-border-brand tw-border-solid tw-shadow-sm hover:tw-bg-button-primary-hover'
                    }
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

            {!isEditing &&
              !tabsToExclude.some((tab) => tab === selectedTab) &&
              (currentUserRoles?.hasAdminRoles || parentInfo) && (
                <div>
                  <CustomButton
                    text="Edit"
                    btnSize="md"
                    heirarchy="primary"
                    iconLeading={<PencilIcon stroke={'white'} />}
                    onClick={() => setIsEditing(true)}
                  />
                </div>
              )}
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
