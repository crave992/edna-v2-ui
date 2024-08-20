export interface UploadImageDto {
  id: number;
  imageName: string;
  imageSize: string;
  imageType: string;
  imageUrl: string;
  createdBy?: string;
  createdOn?: string;
}

export interface MilestoneDto {
  note: string;
  caption?: string;
  image?: UploadImageDto;
  tempImage?: FileList;
  shareWithGuardians: boolean;
  date?: string;
  time?: string;
  lessonState?: string;
  title?: string;
}
