export default interface ClassModel {
  id: number;
  name: string;
  levelId: number;
  semesterId: number;
  capacity: string;
  leadGuideId: number;
  staffClassAssignment: StaffClassAssignmentModel[];
  showBannerGallery: boolean;
  classImageGallery: ClassImageGalleryModel[];
}

export interface StaffClassAssignmentModel {
  staffId: number;
  classId: number;
}

export interface ClassDataModel {
  classId: number;
  className: string;
  id: number;
}

export interface ClassDirectoryDataModel {
  id: number;
  name: string;
  levelId: number;
  levelName: string;
}

export interface ClassImageGalleryModel {
  id: number;
  imageUrl: string;
  createdBy: string;
  createdOn: string;
  imageName: string;
  imageType: string;
  imageSize: string;
}
