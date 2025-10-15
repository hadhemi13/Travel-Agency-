import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany({
      where: { featured: true },
      take: 4
    });
    return NextResponse.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return NextResponse.json({ error: "Error fetching hotels" }, { status: 500 });
  }
}