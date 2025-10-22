import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les programmes favoris de l'utilisateur
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
            favorites: programmesFormatted,
            count: programmesFormatted.length
        });
    } catch (error) {
        console.error('❌ Erreur récupération programmes favoris:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST - Toggle favori (ajouter/supprimer)
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { 
            programmeId, 
            isFavorite,
            programmeData
        } = await request.json();

        if (!programmeId) {
            return NextResponse.json({ error: 'ID du programme requis' }, { status: 400 });
        }

        // Vérifier si le programme est déjà sauvegardé
        const existingSaved = await prisma.savedProgramme.findFirst({
            where: {
                userId: session.user.id,
                programmeId: programmeId
            }
        });

        if (isFavorite) {
            // Ajouter aux favoris
            if (existingSaved) {
                return NextResponse.json({ 
                    success: true,
                    message: 'Programme déjà en favori',
                    alreadySaved: true
                });
            }

            if (!programmeData) {
                return NextResponse.json({ error: 'Données du programme requises' }, { status: 400 });
            }

            // Créer le programme sauvegardé
            const savedProgramme = await prisma.savedProgramme.create({
                data: {
                    userId: session.user.id,
                    programmeId: programmeId,
                    originalProgrammeId: programmeData.originalProgrammeId || null,
                    title: programmeData.title,
                    destinationName: programmeData.destinationName,
                    type: programmeData.type,
                    budget: programmeData.budget,
                    startDate: new Date(programmeData.startDate),
                    endDate: new Date(programmeData.endDate),
                    voyageurs: programmeData.voyageurs,
                    programme: programmeData.programme || {}
                }
            });

            console.log(`✅ Programme ajouté aux favoris: ${savedProgramme.id}`);

            return NextResponse.json({ 
                success: true,
                message: 'Programme ajouté aux favoris',
                savedProgramme: {
                    id: savedProgramme.id,
                    programmeId: savedProgramme.programmeId,
                    title: savedProgramme.title
                }
            });

        } else {
            // Supprimer des favoris
            if (!existingSaved) {
                return NextResponse.json({ 
                    success: true,
                    message: 'Programme déjà supprimé des favoris'
                });
            }

            const deletedProgramme = await prisma.savedProgramme.deleteMany({
                where: {
                    userId: session.user.id,
                    programmeId: programmeId
                }
            });

            console.log(`✅ Programme supprimé des favoris: ${programmeId}`);

            return NextResponse.json({ 
                success: true,
                message: 'Programme supprimé des favoris'
            });
        }

    } catch (error) {
        console.error('❌ Erreur toggle favori:', error);
        return NextResponse.json({ 
            error: 'Erreur serveur', 
            details: error.message 
        }, { status: 500 });
    }
}

// DELETE - Supprimer un programme des favoris
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

        // Supprimer le programme des favoris
        const deletedProgramme = await prisma.savedProgramme.deleteMany({
            where: {
                userId: session.user.id,
                programmeId: programmeId
            }
        });

        if (deletedProgramme.count === 0) {
            return NextResponse.json({ error: 'Programme non trouvé dans les favoris' }, { status: 404 });
        }

        console.log(`✅ Programme supprimé des favoris: ${programmeId}`);

        return NextResponse.json({ 
            success: true,
            message: 'Programme supprimé des favoris'
        });

    } catch (error) {
        console.error('❌ Erreur suppression favori:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
