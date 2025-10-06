import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Offer from "@/models/Offer";

export async function GET() {
  try {
    await connectToDatabase();
    const offers = await Offer.find({ active: true }).sort({ createdAt: -1 });
    return NextResponse.json({ offers, status: 200 });
  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json({ error: "Error fetching offers", status: 500 }, { status: 500 });
  }
}