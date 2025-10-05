import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const authOptions = {
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
          await connectToDatabase();
          
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            throw new Error("No user found with this email");
          }
          
          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            throw new Error("Invalid password");
          }
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            profileImage: user.profileImage,
            mobileNo: user.mobileNo,
            address: user.address,
            nationality: user.nationality,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            profileCompletion: user.profileCompletion,
            emailVerified: user.emailVerified,
            mobileVerified: user.mobileVerified
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
        token.mobileNo = user.mobileNo;
        token.address = user.address;
        token.nationality = user.nationality;
        token.dateOfBirth = user.dateOfBirth;
        token.gender = user.gender;
        token.profileCompletion = user.profileCompletion;
        token.emailVerified = user.emailVerified;
        token.mobileVerified = user.mobileVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.profileImage = token.profileImage;
        session.user.mobileNo = token.mobileNo;
        session.user.address = token.address;
        session.user.nationality = token.nationality;
        session.user.dateOfBirth = token.dateOfBirth;
        session.user.gender = token.gender;
        session.user.profileCompletion = token.profileCompletion;
        session.user.emailVerified = token.emailVerified;
        session.user.mobileVerified = token.mobileVerified;
      }
      return session;
    }
  },
  debug: true
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };