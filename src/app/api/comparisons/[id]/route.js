import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Comparison from '@/models/Comparison';

export async function GET(request, { params }) {
  try {
    // 🔴 FIX Next.js 15: await params
    const { id } = await params;
    
    console.log('🔍 Récupération comparaison ID:', id);

    // Connexion à MongoDB
    await connectToDatabase();

    // Récupérer la comparaison
    const comparison = await Comparison.findById(id);

    if (!comparison) {
      console.log('❌ Comparaison non trouvée');
      return NextResponse.json(
        { error: 'Comparaison non trouvée' },
        { status: 404 }
      );
    }

    console.log('✅ Comparaison trouvée:', comparison._id);
    console.log('📊 programMetrics:', comparison.programMetrics);

    // 🔴 TRANSFORMATION CRITIQUE: programMetrics → programs (pour le frontend)
    const transformedComparison = {
      _id: comparison._id,
      programIds: comparison.programIds,
      userId: comparison.userId,
      destination: comparison.destination,
      createdAt: comparison.createdAt,
      expiresAt: comparison.expiresAt,
      
      // ✅ On transforme programMetrics en programs pour OurListings
      programs: comparison.programMetrics.map((pm, index) => ({
        id: pm.programId,
        name: `Programme ${index + 1} - ${comparison.destination}`,
        image: '/assets/images/default-trip.jpg',
        totalCost: pm.metrics.totalCost.numericValue,
        numberOfDays: pm.metrics.numberOfDays.numericValue,
        metrics: pm.metrics,
        categories: pm.categories
      }))
    };

    console.log('✅ Transformation effectuée, programmes:', transformedComparison.programs.length);

    return NextResponse.json({
      success: true,
      comparison: transformedComparison
    });

  } catch (error) {
    console.error('❌ Erreur récupération comparaison:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    );
  }
}