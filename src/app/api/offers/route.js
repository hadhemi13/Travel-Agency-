import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const offers = await prisma.offre.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ offers, status: 200 });
  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json({ error: "Error fetching offers", status: 500 }, { status: 500 });
  }
}