import { DashboardImageGallery, DashboardImageGallerySkeleton } from '@/components/ui/Directory/Class/ImageGallery';
import siteMetadata from '@/constants/siteMetadata';
import { ClassImageGalleryDto } from '@/dtos/ClassDto';
import RoleDto from '@/dtos/RoleDto';
import { AdminRoles, Role } from '@/helpers/Roles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import BoxInfo, { BoxInfoSkeleton } from './box-info';
import Attendance, { AttendanceSkeleton } from './attendance';
import Birthdays from '@/components/ui/Directory/Class/Birthdays';
import DirectoryTable from '@/components/ui/Directory/DirectoryTable';
import TaskList from './task-list';
import LevelAreaCard from '@/components/ui/LevelAreaCard';
import { LevelAreaCardSkeleton } from '@/components/ui/LevelAreaCardSkeleton';
import MilestoneCard from './milestone-card';
import MilestonesCardSkeletonDashboard from '@/components/ui/Milestones/MilestonesCardSkeletonDashboard';
import { StaffTaskDto } from '@/dtos/StaffTaskDto';
import { TaskListItemSkeleton } from '@/components/ui/TaskList/task-list-item-skeleton';
import PlusIcon from '@/components/svg/PlusIcon';
import { useFocusContext } from '@/context/FocusContext';
import { useAttendanceQuery } from '@/hooks/queries/useAttendanceQuery';
import { useStaffQuery } from '@/hooks/queries/useStaffsQuery';
import { useAdminDashboardQuery } from '@/hooks/queries/useAdminDashboardQuery';
import { useClassesDirectoryQuery } from '@/hooks/queries/useClassesQuery';

const AdminDashboardPage: NextPage = () => {
  const router = useRouter();
  const { organization } = useFocusContext();
  const { data: session, status } = useSession();
  const [roles, setRoles] = useState<string[]>([]);
  const [page, setPage] = useState<number>(1);
  const [recordPerPage, setRecordPerPage] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const queryClient = useQueryClient();
  const [enableInput, setEnableInput] = useState(false);
  const [type, setType] = useState(1);

  const { data: classes, isFetching: isFetchingClasses } = useClassesDirectoryQuery({
    q: '',
    page: page,
    recordPerPage,
    sortBy,
    sortDirection,
    level: '',
    semester: '',
    status: 'Active',
  });
  const { data: staffData, isLoading: isLoadingStaffData } = useStaffQuery({ staffId: Number(session?.user.staffId) });
  const {
    dashboardGallery,
    isLoadingDashboardGallery,
    milestones,
    isLoadingMilestones,
    popularAreas,
    isLoadingPopularAreas,
    statistics,
    isLoadingStatistics,
    upcomingBirthdays,
    isLoadingUpcomingBirthdays,
  } = useAdminDashboardQuery();
  const { data: attendance, isFetching: isAttendanceLoading } = useAttendanceQuery(type);

  useEffect(() => {
    if (session && session.user) {
      let redirectUrl = '';
      const rolesObject = (session.user?.roles || []) as RoleDto[];
      const roles = rolesObject.map((el) => el.name);
      setRoles(roles);

      if (roles.indexOf(Role.Staff) >= 0) {
        if (session.user?.hasClass) {
          redirectUrl = '/staff/dashboard';
        } else {
          redirectUrl = `/staff/${session.user?.staffId}`;
        }
      } else if (roles.indexOf(Role.Parent) >= 0) {
        redirectUrl = '/parent/my-profile';
      }

      router.push(redirectUrl);
    }
  }, [status]);

  const tableHeaders = [
    { name: 'Class', key: 'name', sortable: true, style: '' },
    { name: 'Allergy', key: 'classStaff', sortable: false, style: 'tw-text-left' },
    {
      name:
        organization && organization?.termInfo && organization?.termInfo?.teacher
          ? organization.termInfo.teacher
          : 'Lead Guide',
      key: 'classStaff',
      sortable: false,
      style: '',
    },
    { name: 'Enrolled / Capacity', key: 'capacity', sortable: false, style: '' },
    { name: 'Attendance', key: 'attendance', sortable: true, style: '' },
  ];

  const tableRows = [
    { name: 'Class', key: 'name', type: 'primary', first: true, link: '/directory/class', style: 'tw-py-3xl' },
    { name: 'Allergy', key: 'emergency', type: 'emergency', style: 'tw-text-sm-regular tw-text-tertiary tw-flex tw-items-center tw-justify-center' },
    {
      name:
        organization && organization?.termInfo && organization?.termInfo?.teacher
          ? organization.termInfo.teacher
          : 'Lead Guide',
      key: 'classStaff',
      type: 'lead',
      style: 'tw-text-sm-regular tw-text-tertiary',
    },
    { name: 'Enrolled / Capacity', key: 'capacity', type: 'capacity', style: 'tw-text-sm-regular tw-text-tertiary' },
    { name: 'Attendance', key: 'classAttendance', type: 'attendance', style: 'tw-text-sm-regular tw-text-tertiary' },
  ];

  const handleSortChange = (newSortBy: string, newSortDirection: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
  };

  const taskMutation = useMutation(
    (data: { task: string; method: string; id?: number }) =>
      fetch(`/api/admin/task/${data.id ? data.id : Number(session?.user.staffId)}`, {
        method: data.method,
        body: JSON.stringify(data),
      }),
    {
      onMutate: async (data) => {
        const previousTaskData = queryClient.getQueryData<any>(['staffs', Number(session?.user.staffId)]);

        queryClient.setQueryData(['staffs', Number(session?.user.staffId)], (old: any | undefined) => {
          if (!old) return [];
          let localOld = { ...old };

          if (data.method === 'POST') {
            const newTask = {
              createdOn: new Date(),
              id: previousTaskData ? previousTaskData.userTasks.length + 1 : 0,
              isDone: false,
              staff: null,
              staffId: 0,
              task: data.task,
              updatedOn: new Date(),
            };

            localOld.userTasks.push(newTask);
          } else if (data.method === 'PUT') {
            const index = localOld?.userTasks.findIndex((item: any) => item.id === data.id);
            if (index !== -1) {
              localOld.userTasks[index].isDone = true;
            }
          }

          return localOld;
        });
      },
      onSuccess: (data) => {
        if (data.ok) {
          queryClient.invalidateQueries(['staffs', Number(session?.user.staffId)]);
        }
      },
      onError: (error) => {
        console.log(error);
        console.error('Error saving attendance status:', error);
      },
    }
  );

  const addTask = (newTask: StaffTaskDto) => {
    taskMutation.mutate({ task: newTask.task, method: 'POST' });
  };

  const updateTask = (id: number) => {
    taskMutation.mutate({ task: '', method: 'PUT', id: id });
  };

  return (
    <>
      <Head>
        <title>{`Admin Dashboard | ${siteMetadata.title}`}</title>
      </Head>
      <div className="tw-max-w-screen tw-relative">
        <div className="">
          {AdminRoles.some((role: string) => roles.includes(role)) && (
            <>
              <div className="tw-text-lg-semibold tw-text-primary tw-px-4xl tw-py-2xl">
                {session?.user.organizationName}
              </div>
              <div className="tw-bg-secondary">
                {isLoadingDashboardGallery ? (
                  <DashboardImageGallerySkeleton />
                ) : (
                  <DashboardImageGallery photos={dashboardGallery?.map((image: ClassImageGalleryDto) => image)} />
                )}
              </div>
            </>
          )}
        </div>
        <div className="tw-px-4xl tw-bg-secondary tw-grid tw-max-w-screen tw-grid-cols-[calc(100%-392px)_360px] tw-gap-x-4xl">
          <div className="tw-space-y-3xl tw-pb-4xl">
            {isLoadingStatistics ? <BoxInfoSkeleton /> : <BoxInfo data={statistics} />}
            {isAttendanceLoading ? (
              <AttendanceSkeleton />
            ) : (
              <Attendance
                data={attendance?.attendance}
                total={attendance?.total}
                today={attendance?.today}
                type={type}
                setType={setType}
              />
            )}
            <div className="">
              {upcomingBirthdays && upcomingBirthdays.length > 0 && (
                <Birthdays
                  upcomingBirthdays={upcomingBirthdays}
                  classData={upcomingBirthdays}
                  isLoading={isLoadingUpcomingBirthdays}
                  fromAdminDashboard={true}
                />
              )}
            </div>
            <div className="tw-rounded-xl tw-border tw-border-secondary tw-border-solid tw-bg-primary tw-overflow-hidden tw-border-t-0">
              <DirectoryTable
                isFetching={isFetchingClasses}
                data={classes?.classes}
                tableHeaders={tableHeaders}
                tableRows={tableRows}
                shouldApplyFilters={false}
                searchTerm=""
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
                loaderWidth={'calc(100% - 64px)'}
              />
            </div>
          </div>
          <div className="tw-space-y-5xl">
            <div>
              <div className="tw-pt-4xl tw-space-y-xl tw-flex-wrap tw-flex">
                <div className="tw-flex tw-justify-between tw-w-full tw-items-center">
                  <div className="tw-text-lg-semibold tw-text-primary">Task List</div>
                  <div
                    className="tw-w-[40px] tw-h-[40px] tw-rounded-full tw-bg-button-secondary-bg-hover tw-flex tw-items-center tw-justify-center tw-cursor-pointer"
                    onClick={() => setEnableInput(true)}
                  >
                    <PlusIcon />
                  </div>
                </div>
                {isLoadingStaffData ? (
                  <TaskListItemSkeleton />
                ) : (
                  <TaskList
                    tasks={staffData?.userTasks}
                    addTask={addTask}
                    updateTask={updateTask}
                    enableInput={enableInput}
                    setEnableInput={setEnableInput}
                  />
                )}
              </div>
            </div>
            <div className="tw-space-y-xl">
              <div className="tw-text-lg-semibold tw-text-primary">Most Popular Areas This Week</div>
              <div className="tw-flex tw-space-x-lg">
                {isLoadingPopularAreas ? (
                  <LevelAreaCardSkeleton />
                ) : (
                  popularAreas &&
                  popularAreas.length > 0 &&
                  popularAreas?.map((popular: any, index: number) => {
                    return <LevelAreaCard key={`popular-${index}`} lessonType={popular.area} level={popular.level} />;
                  })
                )}
              </div>
            </div>
            <div className="tw-space-y-xl">
              <div className="tw-flex tw-justify-between tw-items-center">
                <div className="tw-text-lg-semibold tw-text-primary">Recent Milestones</div>
                {/* <div className="tw-cursor-pointer">
                  <DotsHorizontal />
                </div> */}
              </div>
              <div className="tw-flex tw-space-y-xl tw-flex-col">
                {isLoadingMilestones ? (
                  <MilestonesCardSkeletonDashboard />
                ) : (
                  milestones &&
                  milestones.length > 0 &&
                  milestones?.map((milestone: any, index: number) => {
                    return (
                      <MilestoneCard
                        key={`milestones-${index}`}
                        milestone={milestone}
                        isLast={milestones.length - 1 === index}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
