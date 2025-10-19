import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// ✅ Export authOptions so it can be used in other API routes
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });
          
          if (!user) {
            throw new Error("No user found with this email");
          }
          
          const isValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );
          
          if (!isValid) {
            throw new Error("Invalid password");
          }
          
          // ✅ Retourne les données selon ton schéma Prisma
          return {
            id: user.id,
            email: user.email,
            name: user.nom,
            profileImage: user.avatarUrl,
            telephone: user.telephone,
            adresse: user.adresse,
            emailVerified: user.emailVerified,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.profileImage = user.profileImage;
        token.telephone = user.telephone;
        token.adresse = user.adresse;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.profileImage = token.profileImage;
        session.user.telephone = token.telephone;
        session.user.adresse = token.adresse;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    }
  },
  debug: true
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
