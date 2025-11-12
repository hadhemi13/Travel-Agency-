import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // Récupérer tous les programmes de voyage (pour test)
        const programmes = await prisma.programmesVoyage.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log('📊 Programmes trouvés:', programmes.length);
        console.log('📋 Premier programme:', programmes[0]);

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
