import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Récupérer les favoris de l'utilisateur
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        // Récupérer les programmes favoris depuis la table saved_programmes
        const favorites = await prisma.savedProgramme.findMany({
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
        const favoritesFormatted = favorites.map(programme => ({
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
            duration: Math.ceil((new Date(programme.endDate) - new Date(programme.startDate)) / (1000 * 60 * 60 * 24))
        }));

        return NextResponse.json({ favorites: favoritesFormatted });
    } catch (error) {
        console.error('❌ Erreur récupération favoris:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// POST - Ajouter/Retirer des favoris
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { programmeId, isFavorite, programmeData } = await request.json();

        if (isFavorite) {
            // Vérifier si déjà sauvegardé
            const existingSaved = await prisma.savedProgramme.findFirst({
                where: {
                    userId: session.user.id,
                    programmeId: programmeId
                }
            });

            if (existingSaved) {
                return NextResponse.json({ 
                    success: true,
                    message: 'Programme déjà dans les favoris',
                    alreadySaved: true
                });
            }

            // Essayer de trouver le programme original dans programmesVoyage
            let originalProgramme = null;
            try {
                originalProgramme = await prisma.programmesVoyage.findFirst({
                    where: {
                        id: programmeId,
                        userId: session.user.id
                    }
                });
            } catch (error) {
                console.log('Programme non trouvé dans programmesVoyage, utilisation des données fournies');
            }

            // Sauvegarder le programme (avec données originales si disponibles, sinon avec les données fournies)
            const savedProgramme = await prisma.savedProgramme.create({
                data: {
                    userId: session.user.id,
                    programmeId: programmeId,
                    originalProgrammeId: originalProgramme ? programmeId : null,
                    title: programmeData?.title || (originalProgramme ? `${originalProgramme.destinationName} - ${originalProgramme.type}` : 'Programme personnalisé'),
                    destinationName: programmeData?.destinationName || originalProgramme?.destinationName || 'Destination inconnue',
                    type: programmeData?.type || originalProgramme?.type || 'Général',
                    budget: programmeData?.budget || originalProgramme?.budget || 0,
                    startDate: programmeData?.startDate ? new Date(programmeData.startDate) : (originalProgramme?.startDate || new Date()),
                    endDate: programmeData?.endDate ? new Date(programmeData.endDate) : (originalProgramme?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
                    voyageurs: programmeData?.voyageurs || originalProgramme?.voyageurs || 1,
                    programme: originalProgramme?.programme || programmeData?.programme || {}
                }
            });

            console.log(`✅ Programme ${programmeId} ajouté aux favoris`);

            return NextResponse.json({ 
                success: true,
                programme: {
                    id: savedProgramme.id,
                    isFavorite: true
                }
            });

        } else {
            // Retirer des favoris (supprimer de saved_programmes)
            const deletedProgramme = await prisma.savedProgramme.deleteMany({
                where: {
                    userId: session.user.id,
                    programmeId: programmeId
                }
            });

            if (deletedProgramme.count === 0) {
                return NextResponse.json({ error: 'Programme non trouvé dans les favoris' }, { status: 404 });
            }

            console.log(`✅ Programme ${programmeId} retiré des favoris`);

            return NextResponse.json({ 
                success: true,
                programme: {
                    id: programmeId,
                    isFavorite: false
                }
            });
        }

    } catch (error) {
        console.error('❌ Erreur mise à jour favori:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
