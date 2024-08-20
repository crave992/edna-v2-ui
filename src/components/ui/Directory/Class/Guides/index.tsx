import ClassDto, { ClassStaffDto } from '@/dtos/ClassDto';
import Avatar from '@/components/ui/Avatar';
import { useRouter } from 'next/router';
import GuideSkeleton from './GuideSkeleton';
import { useFocusContext } from '@/context/FocusContext';

interface ClassStatsProps {
  classData: ClassDto;
  isLoading: boolean;
}

const ClassGuides = ({ classData, isLoading }: ClassStatsProps) => {
  const router = useRouter();
  const { currentUserRoles, organization } = useFocusContext();

  const sortStaff = (staffA: ClassStaffDto, staffB: ClassStaffDto) => {
    if (staffA.type < staffB.type) return -1;
    if (staffA.type > staffB.type) return 1;
    return 0;
  };

  return (
    <div className="tw-bg-secondary">
      <div className="tw-flex tw-min-w-[1016px] tw-px-4xl tw-gap-x-lg tw-gap-y-lg tw-pt-xl tw-flex-wrap">
        {isLoading ? (
          <GuideSkeleton />
        ) : (
          classData?.classStaff &&
          classData?.classStaff.length > 0 &&
          classData.classStaff
            .slice()
            .sort(sortStaff)
            .map((staff: ClassStaffDto, index: number) => {
              return (
                <div
                  key={index}
                  onClick={() => currentUserRoles?.hasSuperAdminRoles && router.push(`/directory/staff/${staff?.id}`)}
                  className={`tw-flex tw-h-[68px] tw-py-lg tw-pl-xl tw-pr-3xl tw-rounded-full tw-bg-white tw-border tw-border-solid tw-border-secondary 
                  ${
                    !currentUserRoles?.hasSuperAdminRoles
                      ? 'tw-cursor-pointer tw-pointer-events-none'
                      : 'tw-cursor-pointer'
                  }`}
                >
                  <div className="tw-flex tw-space-x-lg tw-items-center tw-justify-center">
                    <Avatar
                      link={staff && staff?.profilePicture ? staff?.profilePicture : ''}
                      photoSize={43}
                      firstName={staff?.firstName}
                      lastName={staff?.lastName}
                    />
                    <div className="tw-flex tw-flex-col tw-text-left">
                      <div className="tw-text-sm-regular tw-text-tertiary">
                        {staff.type == 1
                          ? organization && organization?.termInfo && organization?.termInfo?.teacher
                            ? organization.termInfo.teacher
                            : 'Lead Guide'
                          : staff.type == 2
                          ? organization && organization?.termInfo && organization?.termInfo?.assistant
                            ? organization.termInfo.assistant
                            : 'Associate'
                          : organization && organization?.termInfo && organization?.termInfo?.specialist
                          ? organization.termInfo.specialist
                          : 'Specialist'}
                      </div>
                      <div className="tw-text-lg-medium tw-text-secondary tw-flex tw-truncate">{`${staff.firstName} ${staff.lastName}`}</div>
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};

export default ClassGuides;
