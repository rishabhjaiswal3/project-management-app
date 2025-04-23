import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/server/db";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        if (typeof credentials.email !== "string" || typeof credentials.password !== "string") {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
          },
        });

        if (user && bcrypt.compareSync(credentials.password, user.password ?? "")) {
          console.log("ok ", user);
          return { id: user.id, email: user.email, name: user.name };
        }

        return null;
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id && token.email && token.name) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email,
          name: token.name,
        };
      }
      return session;
    },
  },
} satisfies NextAuthConfig;