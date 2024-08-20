import {
  fetchAdminDashboardGallery,
  fetchMilestones,
  fetchPopularAreas,
  fetchStatistics,
  fetchUpcomingBirthdays,
} from '@/services/api/fetchAdminQueries';
import { useQueries } from '@tanstack/react-query';

export const useAdminDashboardQuery = () => {
  const queries = useQueries({
    queries: [
      { queryKey: ['image-galleries'], queryFn: fetchAdminDashboardGallery },
      { queryKey: ['milestones'], queryFn: fetchMilestones },
      { queryKey: ['popular-areas'], queryFn: fetchPopularAreas },
      { queryKey: ['statistics'], queryFn: fetchStatistics },
      { queryKey: ['upcoming-birthdays'], queryFn: fetchUpcomingBirthdays },
    ],
  });

  return {
    dashboardGallery: queries[0].data,
    isLoadingDashboardGallery: queries[0].isLoading,
    milestones: queries[1].data,
    isLoadingMilestones: queries[1].isLoading,
    popularAreas: queries[2].data,
    isLoadingPopularAreas: queries[2].isLoading,
    statistics: queries[3].data,
    isLoadingStatistics: queries[3].isLoading,
    upcomingBirthdays: queries[4].data,
    isLoadingUpcomingBirthdays: queries[4].isLoading,
  };
};
