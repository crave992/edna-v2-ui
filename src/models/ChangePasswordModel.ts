export interface ChangePasswordModel {
    userId: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface NewAccountChangePasswordModel {
    userId: string;
    roleName: string;
    password: string;
    confirmPassword: string;
    acceptTerms: boolean;
}

export interface VerifyPasswordModel {
    password: string;
}