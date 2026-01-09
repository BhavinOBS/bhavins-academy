import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/activityLogger";
import AzureADProvider from "next-auth/providers/azure-ad";  // ← add this line

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    // ✅ Email/password credentials login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Missing credentials");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password)
          throw new Error("Invalid email or password");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid email or password");

        await logActivity(user.id, "LOGIN", `User signed in with ${user.email}`);
        return { id: user.id, name: user.name, email: user.email };
      },
    }),

    // ✅ Google Sign-In provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ✅ Microsoft Azure Sign-in provider
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/auth/signin" },

  callbacks: {
    async jwt({ token, user, account }) {
      // 🧠 Handle new Google users or returning ones
      if (account?.provider === "google" && user?.email) {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existing) {
          const newUser = await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              image: user.image!,
            },
          });

          await logActivity(newUser.id, "SIGNUP", "Signed up using Google");
        } else {
          await logActivity(existing.id, "LOGIN", "Logged in via Google");
        }
      }

      if (user) token.user = user;
      return token;
    },

    async session({ session, token }) {
      if (token?.user) session.user = token.user;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

