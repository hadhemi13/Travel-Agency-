import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Récupérer un programme de voyage spécifique depuis ProgrammesVoyage
export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { id } = await params;

        const programme = await prisma.programmesVoyage.findFirst({
            where: {
                id: id,
                userId: session.user.id
            }
        });

        if (!programme) {
            return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });
        }

        const programmeFormatted = {
            id: programme.id,
            programmeId: programme.id, // Pour compatibilité
            name: `${programme.destinationName} - ${programme.type}`,
            destination: programme.destinationName,
            type: programme.type,
            budget: programme.budget,
            startDate: programme.startDate,
            endDate: programme.endDate,
            voyageurs: programme.voyageurs,
            programme: programme.programme,
            imageUrl: programme.imageUrl,
            isDone: programme.isDone,
            createdAt: programme.createdAt,
            duration: Math.ceil((new Date(programme.endDate) - new Date(programme.startDate)) / (1000 * 60 * 60 * 24)),
            categoriesActivites: programme.categoriesActivites || {},
            tempsEstime: programme.tempsEstime || {},
            distancesKm: programme.distancesKm || {},
            hotelInfo: programme.hotelInfo || null
        };

        return NextResponse.json({ 
            success: true,
            programme: programmeFormatted
        });

    } catch (error) {
        console.error('❌ Erreur récupération programme:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

