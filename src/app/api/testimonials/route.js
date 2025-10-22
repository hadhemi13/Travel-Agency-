import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Testimonial from "@/models/Testimonial";

export async function GET() {
  try {
    await connectToDatabase();
    const testimonials = await Testimonial.find({ active: true }).sort({ createdAt: -1 });
    return NextResponse.json({ testimonials, status: 200 });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Error fetching testimonials", status: 500 }, { status: 500 });
  }
}