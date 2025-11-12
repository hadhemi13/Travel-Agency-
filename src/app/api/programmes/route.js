import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        // Récupérer les programmes de l'utilisateur connecté
        const programmes = await prisma.programmesVoyage.findMany({
            where: {
                userId: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Transformer les données pour l'affichage
        const programmesFormatted = programmes.map(programme => ({
            id: programme.id,
            name: `${programme.destinationName} - Programme`,
            destination: programme.destinationName,
            type: programme.type,
            budget: programme.budget,
            startDate: programme.startDate,
            endDate: programme.endDate,
            voyageurs: programme.voyageurs,
            programme: programme.programme,
            isDone: programme.isDone,
            createdAt: programme.createdAt,
            // Calculer la durée en jours
            duration: Math.ceil((new Date(programme.endDate) - new Date(programme.startDate)) / (1000 * 60 * 60 * 24))
        }));

        return NextResponse.json({ programmes: programmesFormatted });
    } catch (error) {
        console.error('❌ Erreur récupération programmes:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
