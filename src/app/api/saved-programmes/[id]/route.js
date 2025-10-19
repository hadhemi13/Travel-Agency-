import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET - Récupérer un programme favori spécifique
export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { id } = await params;

        const programme = await prisma.savedProgramme.findFirst({
            where: {
                id: id,
                userId: session.user.id
            },
            include: {
                originalProgramme: true
            }
        });

        if (!programme) {
            return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });
        }

        const programmeFormatted = {
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
            isCustom: programme.isCustom || false,
            customPrompt: programme.customPrompt || null,
            parentId: programme.parentId || null,
            createdAt: programme.savedAt,
            duration: Math.ceil((new Date(programme.endDate) - new Date(programme.startDate)) / (1000 * 60 * 60 * 24))
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

// PUT - Mettre à jour un programme favori
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { id } = await params;
        const { 
            title,
            destinationName,
            type,
            budget,
            startDate,
            endDate,
            voyageurs,
            programme
        } = await request.json();

        // Vérifier que le programme appartient à l'utilisateur
        const existingProgramme = await prisma.savedProgramme.findFirst({
            where: {
                id: id,
                userId: session.user.id
            }
        });

        if (!existingProgramme) {
            return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });
        }

        // Mettre à jour le programme
        const updatedProgramme = await prisma.savedProgramme.update({
            where: { id: id },
            data: {
                ...(title && { title }),
                ...(destinationName && { destinationName }),
                ...(type && { type }),
                ...(budget && { budget }),
                ...(startDate && { startDate: new Date(startDate) }),
                ...(endDate && { endDate: new Date(endDate) }),
                ...(voyageurs && { voyageurs }),
                ...(programme && { programme })
            }
        });

        console.log(`✅ Programme mis à jour: ${updatedProgramme.id}`);

        return NextResponse.json({ 
            success: true,
            programme: {
                id: updatedProgramme.id,
                title: updatedProgramme.title,
                destinationName: updatedProgramme.destinationName,
                type: updatedProgramme.type,
                budget: updatedProgramme.budget
            }
        });

    } catch (error) {
        console.error('❌ Erreur mise à jour programme:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// DELETE - Supprimer un programme favori
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { id } = await params;

        // Vérifier que le programme appartient à l'utilisateur
        const existingProgramme = await prisma.savedProgramme.findFirst({
            where: {
                id: id,
                userId: session.user.id
            }
        });

        if (!existingProgramme) {
            return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });
        }

        // Supprimer le programme
        await prisma.savedProgramme.delete({
            where: { id: id }
        });

        console.log(`✅ Programme supprimé: ${id}`);

        return NextResponse.json({ 
            success: true,
            message: 'Programme supprimé des favoris'
        });

    } catch (error) {
        console.error('❌ Erreur suppression programme:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}