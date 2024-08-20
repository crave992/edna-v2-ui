export default interface AdminDashboardCountDto {
  staff: number;
  classes: number;
  student: number;
  parent: number;
}

export interface AdminDashboardStatistics {
  femaleCount: number;
  guideCount: number;
  maleCount: number;
  staffCount: number;
  studentCount: number;
}
