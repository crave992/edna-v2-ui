export interface JobTitleDto {
  id: number;
  name: string;
  createdOn: Date;
}

export interface JobTitleListResponseDto {
  totalRecord: number;
  jobTitle: JobTitleDto[];
}
