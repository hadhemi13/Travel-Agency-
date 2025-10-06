import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Hotel from "@/models/Hotel";

export async function GET() {
  try {
    await connectToDatabase();
    const hotels = await Hotel.find({ featured: true }).limit(4);
    // Retourner directement le tableau d'hôtels
    return NextResponse.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return NextResponse.json({ error: "Error fetching hotels" }, { status: 500 });
  }
}