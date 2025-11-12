import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();
    
    const userExistance = await prisma.user.findUnique({ 
      where: { email } 
    });
    
    if (userExistance) {
      return NextResponse.json(
        { error: "User already existed" },
        { status: 409 }
      );
    }
    
    const hashpassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: {
        nom: name,
        email: email,
        passwordHash: hashpassword,
      }
    });
    
    return NextResponse.json(
      { message: "User Registred" },
      { status: 201 }
    );

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Error in server" },
      { status: 500 }
    );
  }
}