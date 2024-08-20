import UserDto from "@/dtos/UserDto";
import axios from "axios";

import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import https from "https";

type NextAuthOptionsCallback = (
  req: NextApiRequest,
  res: NextApiResponse
) => NextAuthOptions;

const nextAuthOptions: NextAuthOptionsCallback = (
  req: NextApiRequest,
  res: NextApiResponse
): NextAuthOptions => {
  return {
    providers: [
      CredentialsProvider({
        // The name to display on the sign in form (e.g. "Sign in with...")
        name: "Credentials",
        credentials: {
          username: {
            label: "Email",
            type: "email",
            placeholder: "",
          },
          password: { label: "Password", type: "password" },
          isImpersonating: { label: "IsImpersonating", type: "string" },
          impersonatorToken: { label: "ImpersonatorToken", type: "string" },
          adminToken: { label: "adminToken", type: "string"}
        },
        async authorize(credentials) {
          try {
            const response = await axios.post(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/Login`,
              {
                username: credentials?.username,
                password: credentials?.password,
                isImpersonating: credentials?.isImpersonating,
                impersonatorToken: credentials?.impersonatorToken ?? "",
                adminToken: credentials?.adminToken ?? ""
              },
              {
                headers: {
                  "content-type": "application/json",
                  clientId: `${process.env.NEXT_PUBLIC_API_CLIENT_ID}`,
                },
                httpsAgent: new https.Agent({
                  rejectUnauthorized: false,
                }),
              }
            );

            const cookies = response.headers["set-cookie"] || [];
            res.setHeader("Set-Cookie", cookies);
            return response.data.data.user;
          } catch (error) {
            if (axios.isAxiosError(error)) {
              throw new Error("Invalid email or password");
            } else {
              throw new Error("Some error occured");
            }
          }
        },
      }),
    ],
    secret: `${process.env.NEXTAUTH_SECRET}`,
    callbacks: {
      async jwt({ token, user, trigger, session }) {
        if (trigger === 'update' && session.fullName) {
          token.fullName = session.fullName;
        }

        if (trigger === 'update' && session.profilePicture) {
          token.profilePicture = session.profilePicture;
        }

        if (trigger === 'update' && session.hasAcceptedTermsAndConditions) {
          token.hasAcceptedTermsAndConditions = session.hasAcceptedTermsAndConditions;
        }

        return { ...token, ...user };
      },
      async session({ session, token }) {
        session.user = token as unknown as UserDto;
        return session;
      },
    },
    session: { strategy: "jwt" },
    events: {
      async signOut() {
        res.setHeader("Set-Cookie", [
          "access-token=deleted;Max-Age=0;path=/;",
          "refresh-token=deleted;Max-Age=0;path=/;",
          "user-id=deleted;Max-Age=0;path=/;",
        ]);
      },
    },
    // Enable debug messages in the console if you are having problems
    debug: process.env.NODE_ENV !== "production",
    pages: {
      signIn: "/account/login",
    },
  };
};

const Auth = (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};

export default Auth;
