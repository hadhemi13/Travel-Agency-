import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Comparison from '@/models/Comparison';

export async function GET(request, { params }) {
  try {
    // 🔴 FIX : Await params (Next.js 15+)
    const { id } = await params;
    
    console.log('🔍 Récupération comparaison ID:', id);

    // Connexion à MongoDB
    await connectToDatabase();

    // Récupérer la comparaison avec .lean() pour avoir un objet JS pur
    const comparison = await Comparison.findById(id).lean();

    if (!comparison) {
      console.log('❌ Comparaison non trouvée');
      return NextResponse.json(
        { error: 'Comparaison non trouvée' },
        { status: 404 }
      );
    }

    console.log('✅ Comparaison trouvée:', comparison._id);
    console.log('📊 Clés disponibles:', Object.keys(comparison));
    
    // 🔴 FIX : Vérifier tous les champs possibles
    let programs = [];
    
    if (comparison.programs && Array.isArray(comparison.programs) && comparison.programs.length > 0) {
      console.log('✅ Format "programs" détecté, nombre:', comparison.programs.length);
      programs = comparison.programs;
    } else if (comparison.programMetrics && Array.isArray(comparison.programMetrics) && comparison.programMetrics.length > 0) {
      console.log('🔄 Format "programMetrics" détecté, transformation...');
      programs = comparison.programMetrics.map((pm, index) => ({
        id: pm.programId,
        name: `${comparison.destination} - Programme ${index + 1}`,
        image: '/assets/images/default-trip.jpg',
        totalCost: pm.metrics.totalCost.numericValue,
        numberOfDays: pm.metrics.numberOfDays.numericValue,
        rawData: [],
        metrics: pm.metrics,
        categories: pm.categories
      }));
    } else {
      console.log('❌ Structure de la comparaison:', JSON.stringify(comparison, null, 2));
      return NextResponse.json(
        { error: 'Aucun programme dans cette comparaison' },
        { status: 404 }
      );
    }

    console.log('✅ Programmes extraits:', programs.length);

    // Retourner la comparaison avec le format unifié
    return NextResponse.json({
      success: true,
      comparison: {
        _id: comparison._id.toString(),
        userId: comparison.userId,
        destination: comparison.destination,
        programs: programs,
        recommendation: comparison.recommendation || null,
        createdAt: comparison.createdAt
      }
    });

  } catch (error) {
    console.error('❌ Erreur récupération comparaison:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error.message },
      { status: 500 }
    );
  }
}