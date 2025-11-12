import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany({
      where: {
        featured: true,
        active: true,
      },
      include: {
        destination: {
          select: {
            nom: true,
            pays: true,
            ville: true,
          },
        },
      },
      take: 8,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hotels' },
      { status: 500 }
    );
  }
}