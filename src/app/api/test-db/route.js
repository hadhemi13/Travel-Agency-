import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        console.log('🔍 Test de connexion à la base de données...');
        
        // Test simple de connexion - juste compter
        const count = await prisma.programmesVoyage.count();
        console.log('📊 Nombre total de programmes:', count);
        
        if (count === 0) {
            return NextResponse.json({ 
                success: true,
                message: 'Aucun programme trouvé dans la base de données',
                count: 0,
                programmes: []
            });
        }
        
        // Récupérer les 5 premiers programmes
        const programmes = await prisma.programmesVoyage.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            }
        });
        
        console.log('📋 Programmes récupérés:', programmes.length);
        
        return NextResponse.json({ 
            success: true,
            count,
            programmes: programmes.map(p => ({
                id: p.id,
                destination: p.destinationName,
                type: p.type,
                budget: p.budget,
                createdAt: p.createdAt
            }))
        });
        
    } catch (error) {
        console.error('❌ Erreur test DB:', error);
        return NextResponse.json({ 
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
