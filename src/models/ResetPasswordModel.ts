export default interface ResetPasswordModel {
  userId: string;
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}
