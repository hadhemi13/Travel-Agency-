import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function PATCH(request, context) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const params = await context.params;
        const id = params.id;
        const { isDone } = await request.json();

        // Vérifier que le programme appartient à l'utilisateur
        const programme = await prisma.programmesVoyage.findFirst({
            where: {
                id: id,
                userId: session.user.id
            }
        });

        if (!programme) {
            return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });
        }

        // Mettre à jour le statut
        const updatedProgramme = await prisma.programmesVoyage.update({
            where: { id: id },
            data: { isDone: isDone }
        });

        console.log(`✅ Programme ${id} mis à jour: isDone = ${isDone}`);

        return NextResponse.json({ 
            success: true,
            programme: {
                id: updatedProgramme.id,
                isDone: updatedProgramme.isDone
            }
        });

    } catch (error) {
        console.error('❌ Erreur mise à jour statut programme:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
