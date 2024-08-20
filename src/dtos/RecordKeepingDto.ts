export interface RecordKeepingDto {
  id: number;
  studentId: number;
  classId: number;
  lessonId: number;
  status: string;
  plannedDate: Date | null;
  presentedDate: Date | null;
  practicingDate: Date | null;
  reviewDate: Date | null;
  acquiredDate: Date | null;
  practiceCount: number | null;
  acquiredCount: number | null;
  reviewCount: number | null;
  createdOn: Date;
  rePresented: string;
  history: RecordKeepingHistoryDto[] | null;
  order: number;
}

export interface RecordKeepingHistoryDto {
  id: number;
  recordKeepingId: number;
  recordKeeping: RecordKeepingDto | null;
  status: string;
  actionDate: Date;
  count: number | null;
  createdOn: Date;
  message: string;
  createdByUser: historyCreatedByUser | null;
}

export interface historyCreatedByUser {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  profilePicture: string;
  roles: string;
}
