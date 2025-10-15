import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: "Please enter a valid email" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json(
        { message: "If an account exists with this email, you will receive a reset code." },
        { status: 200 }
      );
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const hashedCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedCode,
        resetExpires: new Date(Date.now() + 10 * 60 * 1000)
      }
    });

    const emailSent = await sendPasswordResetEmail(email, resetCode);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }

    console.log("Reset code:", resetCode);  

    return NextResponse.json(
      { message: "If an account exists with this email, you will receive a reset code." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}