import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/database/drizzle";
import { findUserByEmail } from "@/database/queries";
import { safeParse } from "zod";
import { loginSchema } from "@/lib/validations";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    Google,
    CredentialsProvider({
      async authorize(credentials) {
        const parsedValues = safeParse(loginSchema, credentials);
        const { email, password } = parsedValues.data;

        if (!parsedValues.success) return null;

        const user = await findUserByEmail(email);
        if (!user) return null;
        if (!user.password) return null;

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.passwordChangedAt = user.passwordChangedAt;
        token.pendingEmail = user.pendingEmail;
        token.emailVerified = user.emailVerified;
      }

      if (trigger === "update") {
        const dbUser = await db.query.users.findFirst({
          where: (u, { eq }) => eq(u.id, token.id),
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.pendingEmail = dbUser.pendingEmail;
          token.emailVerified = dbUser.emailVerified;
          token.email = dbUser.email;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (!token?.id || !session.user) return session;

      const user = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.id, token.id),
      });

      if (user) {
        session.user.id = token.id;
        session.user.role = user.role;
        session.user.name = token.name;
        session.user.email = user.email;
        session.user.pendingEmail = user.pendingEmail;
        session.user.emailVerified = user.emailVerified;
      }
      return session;
    },
  },
});
