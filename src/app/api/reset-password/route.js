import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(request) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const hashedCode = crypto
      .createHash('sha256')
      .update(code)
      .digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        resetToken: hashedCode,
        resetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset code" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetExpires: null,
      },
    });

    return NextResponse.json(
      { message: "Password reset successful! You can now login." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}