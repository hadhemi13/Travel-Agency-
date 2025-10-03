import User from "../../../../models/User";
import connectToDatabase from "../../../../lib/db";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { error } from "console";

export async function POST(request) {
  try {
    connectToDatabase();
    const { name, email, password } = await request.json();
    const userExistance = await User.findOne({ email });
    if (userExistance) {
      return NextResponse.json({ error: "User already existed" });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashpassword,
    });
     await newUser.save();
        return NextResponse.json({ message: "User Registred", status: 201 });

  } catch (err) {
    return NextResponse.json({ error: "Error in server", status: 500 });
  }
}
