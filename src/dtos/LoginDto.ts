import UserDto from "./UserDto";

export default interface LoginDto {
  token?: string;
  tokenExpiryDate?: Date;
  refreshToken?: string;
  user?: UserDto;
}
