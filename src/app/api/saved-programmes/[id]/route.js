import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Récupérer un programme sauvegardé spécifique
export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { id } = params;
        console.log('🔍 API: Recherche du programme avec ID:', id, 'pour l\'utilisateur:', session.user.id);

        // Récupérer le programme sauvegardé (chercher par ID, programmeId ou originalProgrammeId)
        const savedProgramme = await prisma.savedProgramme.findFirst({
            where: {
                OR: [
                    { id: id },
                    { programmeId: id },
                    { originalProgrammeId: id }
                ],
                userId: session.user.id
            },
            include: {
                originalProgramme: true
            }
        });

        console.log('📋 API: Programme trouvé:', savedProgramme ? 'OUI' : 'NON');

        if (!savedProgramme) {
            return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });
        }

        // Transformer les données pour l'affichage
        const programmeFormatted = {
            id: savedProgramme.id,
            programmeId: savedProgramme.programmeId,
            originalProgrammeId: savedProgramme.originalProgrammeId,
            title: savedProgramme.title,
            destinationName: savedProgramme.destinationName,
            type: savedProgramme.type,
            budget: savedProgramme.budget,
            startDate: savedProgramme.startDate,
            endDate: savedProgramme.endDate,
            voyageurs: savedProgramme.voyageurs,
            programme: savedProgramme.programme,
            savedAt: savedProgramme.savedAt
        };

        return NextResponse.json({ 
            success: true,
            programme: programmeFormatted
        });
    } catch (error) {
        console.error('❌ Erreur récupération programme sauvegardé:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
