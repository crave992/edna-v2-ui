import LoginDto from "@/dtos/LoginDto";
import UserDto from "@/dtos/UserDto";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: UserDto;
  }
}
