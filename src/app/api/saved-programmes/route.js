import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les programmes sauvegardés de l'utilisateur
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        // Récupérer les programmes sauvegardés de l'utilisateur
        const savedProgrammes = await prisma.savedProgramme.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                originalProgramme: true
            },
            orderBy: {
                savedAt: 'desc'
            }
        });

        // Transformer les données pour l'affichage
        const programmesFormatted = savedProgrammes.map(programme => ({
            id: programme.id,
            programmeId: programme.programmeId,
            originalProgrammeId: programme.originalProgrammeId,
            name: programme.title,
            destination: programme.destinationName,
            type: programme.type,
            budget: programme.budget,
            startDate: programme.startDate,
            endDate: programme.endDate,
            voyageurs: programme.voyageurs,
            programme: programme.programme,
            imageUrl: programme.imageUrl,
            isDone: false, // Les programmes sauvegardés ne sont pas "terminés"
            isFavorite: true, // Tous les programmes sauvegardés sont des favoris
            createdAt: programme.savedAt,
            duration: Math.ceil((new Date(programme.endDate) - new Date(programme.startDate)) / (1000 * 60 * 60 * 24)),
            // Nouveaux champs pour la personnalisation
            isCustom: programme.isCustom || false,
            customPrompt: programme.customPrompt || null,
            parentId: programme.parentId || null
        }));

        return NextResponse.json({ 
            success: true,
            programmes: programmesFormatted,
            count: programmesFormatted.length
        });
    } catch (error) {
        console.error('❌ Erreur récupération programmes sauvegardés:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST - Sauvegarder un programme
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { 
            programmeId, 
            originalProgrammeId,
            title,
            destinationName,
            type,
            budget,
            startDate,
            endDate,
            voyageurs,
            programme,
            imageUrl
        } = await request.json();

        // Vérifier si le programme est déjà sauvegardé
        const existingSaved = await prisma.savedProgramme.findFirst({
            where: {
                userId: session.user.id,
                programmeId: programmeId
            }
        });

        if (existingSaved) {
            return NextResponse.json({ 
                error: 'Ce programme est déjà sauvegardé',
                alreadySaved: true
            }, { status: 409 });
        }

        // Créer le programme sauvegardé
        const savedProgramme = await prisma.savedProgramme.create({
            data: {
                userId: session.user.id,
                programmeId: programmeId,
                originalProgrammeId: originalProgrammeId,
                title: title,
                destinationName: destinationName,
                type: type,
                budget: budget,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                voyageurs: voyageurs,
                programme: programme,
                imageUrl: imageUrl || null
            }
        });

        console.log(`✅ Programme sauvegardé: ${savedProgramme.id}`);

        return NextResponse.json({ 
            success: true,
            savedProgramme: {
                id: savedProgramme.id,
                programmeId: savedProgramme.programmeId,
                title: savedProgramme.title
            }
        });

    } catch (error) {
        console.error('❌ Erreur sauvegarde programme:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// DELETE - Supprimer un programme sauvegardé
export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const programmeId = searchParams.get('programmeId');

        if (!programmeId) {
            return NextResponse.json({ error: 'ID du programme requis' }, { status: 400 });
        }

        // Supprimer le programme sauvegardé
        const deletedProgramme = await prisma.savedProgramme.deleteMany({
            where: {
                userId: session.user.id,
                programmeId: programmeId
            }
        });

        if (deletedProgramme.count === 0) {
            return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });
        }

        console.log(`✅ Programme supprimé des favoris: ${programmeId}`);

        return NextResponse.json({ 
            success: true,
            message: 'Programme supprimé des favoris'
        });

    } catch (error) {
        console.error('❌ Erreur suppression programme:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}