export interface StudentFormDto {
  id: number;
  name: string;
  docUrl: string;
  createdOn: Date;
  updatedOn: Date | null;
  levels: StudentFormLevelMappingBasicDto[];
}

export interface StudentFormLevelMappingBasicDto {
  levelId: number;
  levelName: string;
  isMapped: boolean;
}
