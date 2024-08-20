export interface StudentModel {
    id: number;
    firstName: string;
    middleName: string | null;
    lastName: string;
    nickName: string | null;
    dob: Date | null;
    gender: string;
    levelId: number | null;
    programOptionId: number | null;
    addressLine1: string | null;
    addressLine2: string | null;
    countryId: number | null;
    stateId: number | null;
    city: string | null;
    zipcode: string | null;
    hobbies: string | null;
    achievements: string | null;
    likes: string | null;
    dislikes: string | null;
    strengths: string | null;
    areasOfNeededGrowth: string | null;
    siblingAtSchool: boolean;
    includeInformationInDirectory: boolean;
    isBeforeAndAfterSchoolCareRequire: boolean | string;
    beforeAndAfterSchoolCare: StudentBeforeAndAfterSchoolCareModel;
    ethnicityCategoryId: number;
    ethnicityId: number;
    profileImage: FileList;
    croppedImage: string | null;
    parentEmail: string | null;
    fromTime?: string;
    toTime?: string;
    isActive?: boolean;
    active?: boolean;
    enrolledDate: Date | null;
    startedSchoolDate: Date | null;
    disenrolledDate: Date | null;
}

export interface StudentBeforeAndAfterSchoolCareModel {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    fromTime: string | null;
    toTime: string | null;
}

export interface StudentUpdatePictureModel {
    id: number;
    croppedImage: string;
}