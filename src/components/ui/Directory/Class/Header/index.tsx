import PencilIcon from '@/components/svg/PencilIcon';
import ExternalLinkIcon from '@/components/svg/ExternalLinkIcon';
import ClassDto from '@/dtos/ClassDto';
import { useRouter } from 'next/router';
import { useFocusContext } from '@/context/FocusContext';
import ImageIcon from '@/components/svg/ImageIcon';
import AddEditClass from '@/components/ui/AddEditClass';
import UncontrolledDropdown from '@/components/ui/Uncontrolled/UncontrolledDropdown';
import { UserContext } from '@/context/UserContext';
import { useContext, useEffect, useState } from 'react';
import CustomButton from '@/components/ui/CustomButton';
import { useQueryClient } from '@tanstack/react-query';
import { replaceLevelName } from '@/utils/replaceLevelName';

interface HeaderProps {
  classData: ClassDto;
  classId: number | undefined;
  showEditGalleryModal: boolean;
  setShowEditGalleryModal: (showEditGalleryModal: boolean) => void;
  showEditClassModal: boolean;
  setShowEditClassModal: (showEditGalleryModal: boolean) => void;
}

const Header = ({
  classData,
  classId,
  showEditGalleryModal,
  setShowEditGalleryModal,
  showEditClassModal,
  setShowEditClassModal,
}: HeaderProps) => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { currentUserRoles, setClassId, setLevelId, setAreaId, setTopicId, setStudentId, classes, organization } =
    useFocusContext();
  const [hasLeadUser, setHasLeadUser] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleOnClick = () => {
    setLevelId(classData?.levelId);
    setClassId(classId);
    setAreaId(undefined);
    setTopicId(undefined);
    setStudentId(undefined);
    router.push('/focus/student');
  };

  const handleSelectClass = (selectedClass: ClassDto) => {
    setClassId(selectedClass.id);
    setLevelId(selectedClass.levelId);
    queryClient.invalidateQueries(['students-directory', 'milestones', { class: selectedClass.id }]);
    if (currentUserRoles?.hasAdminRoles) router.push(`/directory/class/${selectedClass.id}`);
  };

  useEffect(() => {
    if (
      user?.staffId &&
      classData?.classStaff?.some((staff) => staff.id === user.staffId) &&
      currentUserRoles?.isLeadGuide &&
      currentUserRoles?.hasAdminRoles
    ) {
      setHasLeadUser(true);
    } else {
      setHasLeadUser(false);
    }
  }, [user, classData, classId]);

  if (classData?.level) {
    classData.level.name = replaceLevelName(classData?.level?.name, organization?.termInfo);
  }

  return (
    <div className="tw-min-w-[1016px] tw-mx-4xl">
      <div className="tw-flex tw-w-full tw-pt-2xl tw-pb-xl tw-spacing-2xl tw-items-center tw-justify-between">
        <div>
          <div className="tw-flex tw-flex-row tw-space-x-md tw-items-center">
            {classData && (
              <UncontrolledDropdown
                data={classes && classes?.length > 0 ? classes : []}
                containerClassName={`!tw-border-transparent !tw-px-0 ${
                  classes && classes?.length == 1 && '!tw-border-transparent !tw-cursor-default'
                }`}
                setSelectedItems={handleSelectClass}
                dropdownClassName="!tw-w-[200px] !tw-mt-0"
                textClassName="!tw-text-lg-semibold !tw-text-primary"
                iconColor="primary"
                iconSize="24"
                selectedItems={classData || null}
                component="Class"
                anchorRight={false}
              />
            )}
          </div>

          <div className="tw-text-tertiary tw-text-sm-regular">
            {classData ? `${classData?.level?.name} Level` : ''}
          </div>
        </div>
        <div className="tw-flex tw-flex-row tw-gap-lg">
          {(currentUserRoles?.hasSuperAdminRoles ||
            (currentUserRoles?.isStaff && currentUserRoles?.isLeadGuide) ||
            hasLeadUser) && (
            <CustomButton
              text="Edit Gallery"
              btnSize="md"
              heirarchy="secondary-gray"
              className="!tw-w-auto"
              iconLeading={<ImageIcon />}
              onClick={() => setShowEditGalleryModal(!showEditGalleryModal)}
              disabled={!classData}
            />
          )}
          {currentUserRoles?.hasAdminRoles && (
            <CustomButton
              text="Edit Class"
              btnSize="md"
              heirarchy="secondary-gray"
              className="!tw-w-auto"
              iconLeading={<PencilIcon stroke="#344054" />}
              onClick={() => setShowEditClassModal(!showEditClassModal)}
              disabled={!classData}
            />
          )}
          <CustomButton
            text="Open Focus"
            btnSize="md"
            heirarchy="secondary-color"
            className="!tw-w-auto"
            iconTrailing={<ExternalLinkIcon stroke="#0D5597" />}
            onClick={() => handleOnClick()}
            disabled={!classData}
          />
        </div>
        <AddEditClass
          showModal={showEditClassModal}
          setShowModal={setShowEditClassModal}
          isEdit={true}
          classData={classData}
        />
      </div>
    </div>
  );
};

export default Header;
