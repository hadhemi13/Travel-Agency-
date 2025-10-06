import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request) {
  try {
    await connectToDatabase();
    
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: "Please enter a valid email" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: "If an account exists with this email, you will receive a reset code." },
        { status: 200 }
      );
    }

    // Generate 6-digit code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash the code before storing
    const hashedCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');

    // Save hashed code and expiry (10 minutes)
    user.resetPasswordToken = hashedCode;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send email with the plain code
    const emailSent = await sendPasswordResetEmail(email, resetCode);

    if (!emailSent) {
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      );
    }

    // For development, log the code (REMOVE IN PRODUCTION)
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