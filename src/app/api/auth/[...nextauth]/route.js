import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              passwordHash: true,
              nom: true,
              avatarUrl: true,
              telephone: true,
              adresse: true,
              emailVerified: true,
              role: true
            }
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
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only",
  url: process.env.NEXTAUTH_URL || "http://localhost:3000",
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Update token when session is updated
      if (trigger === "update" && session) {
        return { ...token, ...session };
      }
      
      if (user) {
        token.id = user.id;
        token.profileImage = user.profileImage;
        token.telephone = user.telephone;
        token.adresse = user.adresse;
        token.emailVerified = user.emailVerified;
        token.datenaissance = user.datenaissance;
        token.genre = user.genre;
        token.nationalite = user.nationalite;
        token.role = user.role;
        token.profileCompletion = user.profileCompletion;
        token.mobileVerified = user.mobileVerified;
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
        session.user.datenaissance = token.datenaissance;
        session.user.genre = token.genre;
        session.user.nationalite = token.nationalite;
        session.user.role = token.role;
        session.user.profileCompletion = token.profileCompletion;
        session.user.mobileVerified = token.mobileVerified;
      }
      return session;
    }
  },
  debug: false
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };