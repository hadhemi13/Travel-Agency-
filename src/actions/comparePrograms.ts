'use server';

import { AuthOptions, getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/db';
import Comparison from '@/models/Comparison';

interface ProgramData {
  supabaseId: string | null;
  destination: string;
  type: string;
  budget: number;
  startDate: string;
  endDate: string;
  voyageurs: number;
  programme: any[];
}

// Fonction pour calculer les métriques réelles
function calculateMetrics(programme: any[], budget: number) {
  const numberOfDays = programme.length;
  const totalCost = programme.reduce((sum, day) => sum + (day.cout || 0), 0);
  const avgCostPerDay = numberOfDays > 0 ? totalCost / numberOfDays : 0;
  
  const totalActivities = programme.reduce((sum, day) => {
    let count = 0;
    if (day.matin) count++;
    if (day.apresmidi) count++;
    if (day.soir) count++;
    return sum + count;
  }, 0);
  
  const totalDistance = programme.reduce((sum, day) => sum + (day.distanceKm || 0), 0);
  
  const categories = new Set<string>();
  programme.forEach(day => {
    if (day.categorieActivites) {
      Object.values(day.categorieActivites).forEach(cat => {
        if (cat) categories.add(cat as string);
      });
    }
  });
  
  const avgIntensity = programme.reduce((sum, day) => {
    if (day.tempsEstime) {
      const dailyTime = (day.tempsEstime.matin || 0) + 
                       (day.tempsEstime.apresmidi || 0) + 
                       (day.tempsEstime.soir || 0);
      return sum + dailyTime;
    }
    return sum;
  }, 0) / numberOfDays;
  
  const hotel = programme[0]?.hotel;
  const valueScore = totalActivities > 0 ? (totalActivities * 10) / (totalCost + 1) : 0;
  
  return {
    totalCost: {
      value: `${totalCost}€`,
      numericValue: totalCost,
      isWinner: false
    },
    avgCostPerDay: {
      value: `${Math.round(avgCostPerDay)}€/day`,
      numericValue: avgCostPerDay,
      isWinner: false
    },
    hotel: {
      value: hotel?.nom || 'N/A',
      stars: hotel?.etoiles || 0,
      isWinner: false
    },
    numberOfDays: {
      value: `${numberOfDays} days`,
      numericValue: numberOfDays,
      isWinner: false
    },
    totalActivities: {
      value: `${totalActivities} activities`,
      numericValue: totalActivities,
      isWinner: false
    },
    totalDistance: {
      value: `${totalDistance} km`,
      numericValue: totalDistance,
      isWinner: false
    },
    activityDiversity: {
      value: `${categories.size} categories`,
      numericValue: categories.size,
      isWinner: false
    },
    avgIntensity: {
      value: `${Math.round(avgIntensity)}h/day`,
      numericValue: avgIntensity,
      isWinner: false
    },
    valueForMoney: {
      value: valueScore > 5 ? 'Excellent' : valueScore > 2 ? 'Good' : 'Fair',
      score: valueScore,
      isWinner: false
    }
  };
}

// Fonction pour extraire les catégories
function extractCategories(programme: any[]) {
  const categories = {
    culture: false,
    nature: false,
    gastronomy: false,
    adventure: false,
    relaxation: false,
    shopping: false,
    nightlife: false,
    sports: false
  };
  
  programme.forEach(day => {
    if (day.categorieActivites) {
      Object.values(day.categorieActivites).forEach(cat => {
        const category = (cat as string).toLowerCase();
        if (category === 'culture') categories.culture = true;
        if (category === 'nature') categories.nature = true;
        if (category === 'gastronomie' || category === 'gastronomy') categories.gastronomy = true;
        if (category === 'aventure' || category === 'adventure') categories.adventure = true;
        if (category === 'relaxation' || category === 'détente') categories.relaxation = true;
        if (category === 'shopping') categories.shopping = true;
        if (category === 'nightlife' || category === 'vie nocturne') categories.nightlife = true;
        if (category === 'sports' || category === 'sport') categories.sports = true;
      });
    }
  });
  
  return categories;
}

// Fonction pour déterminer les gagnants
function determineWinners(metrics1: any, metrics2: any) {
  if (metrics1.totalCost.numericValue < metrics2.totalCost.numericValue) {
    metrics1.totalCost.isWinner = true;
  } else if (metrics2.totalCost.numericValue < metrics1.totalCost.numericValue) {
    metrics2.totalCost.isWinner = true;
  }
  
  const higherIsBetter = [
    'numberOfDays', 'totalActivities', 'activityDiversity', 'valueForMoney'
  ];
  
  higherIsBetter.forEach(metric => {
    if (metrics1[metric].numericValue > metrics2[metric].numericValue) {
      metrics1[metric].isWinner = true;
    } else if (metrics2[metric].numericValue > metrics1[metric].numericValue) {
      metrics2[metric].isWinner = true;
    }
  });
  
  if (metrics1.hotel.stars > metrics2.hotel.stars) {
    metrics1.hotel.isWinner = true;
  } else if (metrics2.hotel.stars > metrics1.hotel.stars) {
    metrics2.hotel.isWinner = true;
  }
}

export async function comparePrograms(
  program1Data: ProgramData,
  program2Data: ProgramData
) {
  try {
    console.log('🚀 DÉBUT comparePrograms');
    console.log('📦 Program1 ID:', program1Data.supabaseId);
    console.log('📦 Program2 ID:', program2Data.supabaseId);

    // 1. Vérifier l'authentification
    const session = await getServerSession(authOptions as AuthOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
      console.log('❌ User non authentifié');
      return {
        success: false,
        error: 'Vous devez être connecté pour comparer des programmes'
      };
    }

    console.log('🔐 User authentifié:', userId);

    // 2. Connecter à MongoDB
    console.log('🔌 Connexion à MongoDB...');
    await connectToDatabase();
    console.log('✅ MongoDB connecté');

    // 🔴 SUPPRESSION de la vérification des IDs (elle est faite dans handleComparePrograms maintenant)
    console.log('✅ IDs reçus - P1:', program1Data.supabaseId, 'P2:', program2Data.supabaseId);

    // 4. Calculer les métriques RÉELLES
    console.log('📊 Calcul des métriques...');
    console.log('Programme 1 jours:', program1Data.programme.length);
    console.log('Programme 2 jours:', program2Data.programme.length);
    
    const program1Metrics = calculateMetrics(program1Data.programme, program1Data.budget);
    const program2Metrics = calculateMetrics(program2Data.programme, program2Data.budget);
    
    console.log('✅ Métriques calculées');
    console.log('P1 coût total:', program1Metrics.totalCost.numericValue);
    console.log('P2 coût total:', program2Metrics.totalCost.numericValue);
    
    determineWinners(program1Metrics, program2Metrics);
    console.log('✅ Winners déterminés');

    // 5. Extraire les catégories RÉELLES
    console.log('🏷️ Extraction des catégories...');
    const program1Categories = extractCategories(program1Data.programme);
    const program2Categories = extractCategories(program2Data.programme);
    console.log('✅ Catégories extraites');
    console.log('P1 categories:', program1Categories);
    console.log('P2 categories:', program2Categories);

    // 6. 🔴 CORRECTION: Structure compatible avec le modèle MongoDB
    const comparisonData = {
      programIds: [program1Data.supabaseId, program2Data.supabaseId],
      userId: userId,
      destination: program1Data.destination,
      programMetrics: [
        {
          programId: program1Data.supabaseId,
          metrics: program1Metrics,
          categories: program1Categories
        },
        {
          programId: program2Data.supabaseId,
          metrics: program2Metrics,
          categories: program2Categories
        }
      ]
    };

    console.log('📝 Données de comparaison prêtes');
    console.log('Structure:', JSON.stringify(comparisonData, null, 2));

    // 7. SAUVEGARDER dans MongoDB
    console.log('💾 Sauvegarde dans MongoDB...');
    const comparison = await Comparison.create(comparisonData);
    
    console.log('✅ Comparaison créée avec succès dans MongoDB!');
    console.log('📝 ID de la comparaison:', comparison._id.toString());

    return {
      success: true,
      comparisonId: comparison._id.toString(),
      message: 'Comparaison créée avec succès'
    };

  } catch (error: any) {
    console.error('❌ ERREUR COMPLÈTE dans comparePrograms:', error);
    console.error('❌ Stack:', error.stack);
    return {
      success: false,
      error: error.message || 'Erreur lors de la comparaison des programmes'
    };
  }
}