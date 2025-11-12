'use server';

import { AuthOptions, getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectToDatabase from '@/lib/db';
import Comparison from '@/models/Comparison';
import { generateComparisonImage } from '@/lib/imageGenerator';

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
        if (cat && typeof cat === 'string') {
          const category = cat.toLowerCase();
          if (category === 'culture') categories.culture = true;
          if (category === 'nature') categories.nature = true;
          if (category === 'gastronomie' || category === 'gastronomy') categories.gastronomy = true;
          if (category === 'aventure' || category === 'adventure') categories.adventure = true;
          if (category === 'relaxation' || category === 'détente') categories.relaxation = true;
          if (category === 'shopping') categories.shopping = true;
          if (category === 'nightlife' || category === 'vie nocturne') categories.nightlife = true;
          if (category === 'sports' || category === 'sport') categories.sports = true;
        }
      });
    }
  });

  return categories;
}

// Fonction pour déterminer les gagnants
function determineWinners(metrics1: any, metrics2: any) {
  // Le moins cher gagne
  if (metrics1.totalCost.numericValue < metrics2.totalCost.numericValue) {
    metrics1.totalCost.isWinner = true;
  } else if (metrics2.totalCost.numericValue < metrics1.totalCost.numericValue) {
    metrics2.totalCost.isWinner = true;
  }

  // Le moins cher par jour gagne
  if (metrics1.avgCostPerDay.numericValue < metrics2.avgCostPerDay.numericValue) {
    metrics1.avgCostPerDay.isWinner = true;
  } else if (metrics2.avgCostPerDay.numericValue < metrics1.avgCostPerDay.numericValue) {
    metrics2.avgCostPerDay.isWinner = true;
  }

  const higherIsBetter = [
    'numberOfDays', 'totalActivities', 'activityDiversity', 'valueForMoney'
  ];

  higherIsBetter.forEach(metric => {
    const val1 = metric === 'valueForMoney' ? metrics1[metric].score : metrics1[metric].numericValue;
    const val2 = metric === 'valueForMoney' ? metrics2[metric].score : metrics2[metric].numericValue;

    if (val1 > val2) {
      metrics1[metric].isWinner = true;
    } else if (val2 > val1) {
      metrics2[metric].isWinner = true;
    }
  });

  if (metrics1.hotel.stars > metrics2.hotel.stars) {
    metrics1.hotel.isWinner = true;
  } else if (metrics2.hotel.stars > metrics1.hotel.stars) {
    metrics2.hotel.isWinner = true;
  }
}

// 🔴 NOUVELLE FONCTION : Générer une recommandation intelligente
function generateSmartRecommendation(
  metrics1: any,
  metrics2: any,
  categories1: any,
  categories2: any,
  userBudget: number,
  userType: string
) {
  const recommendations = [];
  let bestProgram = 0; // 0 = égalité, 1 = programme 1, 2 = programme 2
  let score1 = 0;
  let score2 = 0;

  // Analyse du budget
  const budgetDiff1 = Math.abs(metrics1.totalCost.numericValue - userBudget);
  const budgetDiff2 = Math.abs(metrics2.totalCost.numericValue - userBudget);

  if (budgetDiff1 < budgetDiff2) {
    recommendations.push(`Le **Programme 1** est plus proche de votre budget initial (${userBudget}€) avec un écart de seulement ${budgetDiff1}€.`);
    score1 += 3;
  } else if (budgetDiff2 < budgetDiff1) {
    recommendations.push(`Le **Programme 2** respecte mieux votre budget avec un écart de ${budgetDiff2}€ contre ${budgetDiff1}€ pour le Programme 1.`);
    score2 += 3;
  }

  // Analyse du rapport qualité-prix
  if (metrics1.valueForMoney.score > metrics2.valueForMoney.score) {
    recommendations.push(`Le **Programme 1** offre un meilleur rapport qualité-prix avec ${metrics1.totalActivities.numericValue} activités pour ${metrics1.totalCost.numericValue}€.`);
    score1 += 2;
  } else if (metrics2.valueForMoney.score > metrics1.valueForMoney.score) {
    recommendations.push(`Le **Programme 2** présente un meilleur rapport qualité-prix (${metrics2.valueForMoney.value}).`);
    score2 += 2;
  }

  // Analyse de l'hôtel
  if (metrics1.hotel.stars > metrics2.hotel.stars) {
    recommendations.push(`Le **Programme 1** propose un hôtel plus luxueux : **${metrics1.hotel.value}** (${metrics1.hotel.stars}★) contre **${metrics2.hotel.value}** (${metrics2.hotel.stars}★).`);
    score1 += 1;
  } else if (metrics2.hotel.stars > metrics1.hotel.stars) {
    recommendations.push(`Le **Programme 2** vous offre un meilleur hébergement avec ${metrics2.hotel.stars} étoiles.`);
    score2 += 1;
  }

  // Analyse de la diversité des activités
  if (metrics1.activityDiversity.numericValue > metrics2.activityDiversity.numericValue) {
    recommendations.push(`Le **Programme 1** est plus varié avec ${metrics1.activityDiversity.numericValue} types d'activités différentes.`);
    score1 += 2;
  } else if (metrics2.activityDiversity.numericValue > metrics1.activityDiversity.numericValue) {
    recommendations.push(`Le **Programme 2** offre plus de diversité (${metrics2.activityDiversity.numericValue} catégories d'activités).`);
    score2 += 2;
  }

  // Analyse du type de voyage
  const typePreferences: { [key: string]: string[] } = {
    'Aventure': ['adventure', 'nature', 'sports'],
    'Culturel': ['culture', 'gastronomy'],
    'Détente': ['relaxation', 'gastronomy'],
    'Shopping': ['shopping', 'nightlife'],
    'Romantique': ['gastronomy', 'relaxation', 'culture']
  };

  if (typePreferences[userType]) {
    const preferredCategories = typePreferences[userType];
    let matchScore1 = 0;
    let matchScore2 = 0;

    preferredCategories.forEach(cat => {
      if (categories1[cat]) matchScore1++;
      if (categories2[cat]) matchScore2++;
    });

    if (matchScore1 > matchScore2) {
      recommendations.push(`Le **Programme 1** correspond mieux à votre type de voyage "${userType}" avec ${matchScore1} catégories pertinentes.`);
      score1 += 3;
    } else if (matchScore2 > matchScore1) {
      recommendations.push(`Le **Programme 2** est plus adapté à un voyage "${userType}".`);
      score2 += 3;
    }
  }

  // Analyse de l'intensité
  if (metrics1.avgIntensity.numericValue < metrics2.avgIntensity.numericValue) {
    recommendations.push(`Le **Programme 1** est plus relaxant avec ${metrics1.avgIntensity.value} d'activités par jour.`);
  } else if (metrics2.avgIntensity.numericValue < metrics1.avgIntensity.numericValue) {
    recommendations.push(`Le **Programme 2** propose un rythme plus tranquille (${metrics2.avgIntensity.value}).`);
  }

  // Analyse de la distance
  if (metrics1.totalDistance.numericValue < metrics2.totalDistance.numericValue) {
    recommendations.push(`Le **Programme 1** implique moins de déplacements (${metrics1.totalDistance.value} contre ${metrics2.totalDistance.value}).`);
  } else if (metrics2.totalDistance.numericValue < metrics1.totalDistance.numericValue) {
    recommendations.push(`Le **Programme 2** nécessite moins de transport.`);
  }

  // Déterminer le meilleur programme
  if (score1 > score2) {
    bestProgram = 1;
  } else if (score2 > score1) {
    bestProgram = 2;
  }

  // Générer la conclusion
  let conclusion = '';
  if (bestProgram === 1) {
    conclusion = `🏆 **Notre recommandation : Programme 1**\n\nBasé sur vos critères (budget de ${userBudget}€, voyage ${userType}), le Programme 1 semble être le meilleur choix. Il offre ${budgetDiff1 < budgetDiff2 ? 'un meilleur respect de votre budget' : ''
      } ${metrics1.valueForMoney.score > metrics2.valueForMoney.score ? 'et un excellent rapport qualité-prix' : ''
      }.`;
  } else if (bestProgram === 2) {
    conclusion = `🏆 **Notre recommandation : Programme 2**\n\nLe Programme 2 correspond mieux à vos attentes avec ${budgetDiff2 < budgetDiff1 ? 'un respect optimal de votre budget' : ''
      } ${metrics2.hotel.stars > metrics1.hotel.stars ? 'et un hébergement de meilleure qualité' : ''
      }.`;
  } else {
    conclusion = `⚖️ **Les deux programmes sont équivalents**\n\nLes deux options offrent une qualité similaire. Choisissez selon vos préférences personnelles : le Programme 1 pour ${metrics1.hotel.value} ou le Programme 2 pour ${metrics2.hotel.value}.`;
  }

  return {
    recommendations: recommendations.join('\n\n'),
    conclusion,
    scores: { program1: score1, program2: score2 },
    bestProgram
  };
}

type MetricPreference = 'lower' | 'higher' | 'valueScore' | 'hotelStars';

function cloneMetric(metric: any = {}) {
  return JSON.parse(JSON.stringify(metric || {}));
}

function pickBestMetric(
  metric1: any,
  metric2: any,
  preference: MetricPreference
) {
  const cloned1 = cloneMetric(metric1);
  const cloned2 = cloneMetric(metric2);

  if (!metric1 && !metric2) {
    return { metric: {}, winner: 0 };
  }
  if (metric1 && !metric2) {
    cloned1.isWinner = true;
    return { metric: cloned1, winner: 1 };
  }
  if (!metric1 && metric2) {
    cloned2.isWinner = true;
    return { metric: cloned2, winner: 2 };
  }

  let value1 = 0;
  let value2 = 0;

  switch (preference) {
    case 'lower':
      value1 = metric1.numericValue ?? Number.POSITIVE_INFINITY;
      value2 = metric2.numericValue ?? Number.POSITIVE_INFINITY;
      break;
    case 'higher':
      value1 = metric1.numericValue ?? Number.NEGATIVE_INFINITY;
      value2 = metric2.numericValue ?? Number.NEGATIVE_INFINITY;
      break;
    case 'valueScore':
      value1 = metric1.score ?? Number.NEGATIVE_INFINITY;
      value2 = metric2.score ?? Number.NEGATIVE_INFINITY;
      break;
    case 'hotelStars':
      value1 = metric1.stars ?? 0;
      value2 = metric2.stars ?? 0;
      break;
  }

  let winner = 1;
  let selected = cloned1;

  if (
    (preference === 'lower' && value2 < value1) ||
    (preference === 'higher' && value2 > value1) ||
    (preference === 'valueScore' && value2 > value1) ||
    (preference === 'hotelStars' && value2 > value1)
  ) {
    winner = 2;
    selected = cloned2;
  } else if (
    (preference === 'lower' && value2 === value1 && value2 < value1) ||
    (['higher', 'valueScore', 'hotelStars'].includes(preference) && value2 === value1 && value2 > value1)
  ) {
    winner = 2;
    selected = cloned2;
  }

  selected.isWinner = true;
  return { metric: selected, winner };
}

function createOptimizedProgram(
  program1Data: ProgramData,
  program2Data: ProgramData,
  metrics1: any,
  metrics2: any,
  categories1: any,
  categories2: any,
  program1Image: string | null,
  program2Image: string | null,
  recommendation: { bestProgram: number }
) {
  const winnerCount: Record<number, number> = { 1: 0, 2: 0 };

  const getMetric = (
    key: string,
    preference: MetricPreference
  ) => {
    const { metric, winner } = pickBestMetric(metrics1[key], metrics2[key], preference);
    if (winner) {
      winnerCount[winner] = (winnerCount[winner] || 0) + 1;
    }
    return { metric, winner };
  };

  const totalCost = getMetric('totalCost', 'lower');
  const avgCostPerDay = getMetric('avgCostPerDay', 'lower');
  const numberOfDays = getMetric('numberOfDays', 'higher');
  const totalActivities = getMetric('totalActivities', 'higher');
  const activityDiversity = getMetric('activityDiversity', 'higher');
  const valueForMoney = getMetric('valueForMoney', 'valueScore');
  const hotel = getMetric('hotel', 'hotelStars');
  const avgIntensity = getMetric('avgIntensity', 'lower');
  const totalDistance = getMetric('totalDistance', 'lower');

  let dominantProgram = recommendation.bestProgram;
  if (!dominantProgram || dominantProgram === 0) {
    dominantProgram = winnerCount[1] >= winnerCount[2] ? 1 : 2;
  }

  const baseMetrics = dominantProgram === 1 ? metrics1 : metrics2;
  const baseCategories = dominantProgram === 1 ? categories1 : categories2;
  const baseData = dominantProgram === 1 ? program1Data : program2Data;
  const baseImage = dominantProgram === 1 ? program1Image : program2Image;

  const mergedCategories = Object.keys({
    ...categories1,
    ...categories2
  }).reduce((acc: Record<string, boolean>, key) => {
    acc[key] = Boolean(categories1[key] || categories2[key]);
    return acc;
  }, {});

  const metrics = {
    totalCost: totalCost.metric,
    avgCostPerDay: avgCostPerDay.metric,
    hotel: hotel.metric,
    numberOfDays: numberOfDays.metric,
    totalActivities: totalActivities.metric,
    totalDistance: totalDistance.metric?.numericValue !== undefined
      ? totalDistance.metric
      : cloneMetric(baseMetrics.totalDistance),
    activityDiversity: activityDiversity.metric,
    avgIntensity: avgIntensity.metric?.numericValue !== undefined
      ? avgIntensity.metric
      : cloneMetric(baseMetrics.avgIntensity),
    valueForMoney: valueForMoney.metric?.score !== undefined
      ? valueForMoney.metric
      : cloneMetric(baseMetrics.valueForMoney)
  };

  const optimizedProgram = {
    id: null,
    name: `${baseData.destination} - Programme optimisé`,
    image: baseImage,
    totalCost: metrics.totalCost.numericValue ?? baseMetrics.totalCost.numericValue,
    numberOfDays: metrics.numberOfDays.numericValue ?? baseMetrics.numberOfDays.numericValue,
    rawData: baseData.programme,
    metrics,
    categories: mergedCategories,
    origin: {
      dominantProgram,
      winnerCount
    }
  };

  return optimizedProgram;
}

export async function comparePrograms(
  program1Data: ProgramData,
  program2Data: ProgramData
) {
  try {
    console.log('🚀 DÉBUT comparePrograms');

    // 1. Vérifier l'authentification
    const session = await getServerSession(authOptions as AuthOptions);
    const userId = (session?.user as any)?.id;

    if (!userId) {
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

    // 3. Calculer les métriques RÉELLES
    console.log('📊 Calcul des métriques...');
    const program1Metrics = calculateMetrics(program1Data.programme, program1Data.budget);
    const program2Metrics = calculateMetrics(program2Data.programme, program2Data.budget);

    determineWinners(program1Metrics, program2Metrics);

    // 4. Extraire les catégories RÉELLES
    console.log('🏷️ Extraction des catégories...');
    const program1Categories = extractCategories(program1Data.programme);
    const program2Categories = extractCategories(program2Data.programme);
    console.log('🎨 Génération des images...');

    // ✅ PASSER 1 pour le premier programme
    const program1Image = generateComparisonImage(
      program1Data.destination,
      program1Data.type,
      program1Metrics,
      program1Categories,
      1 // ✅ Premier programme
    );

    // ✅ PASSER 2 pour le deuxième programme
    const program2Image = generateComparisonImage(
      program2Data.destination,
      program2Data.type,
      program2Metrics,
      program2Categories,
      2 // ✅ Deuxième programme
    );

    console.log('✅ Images générées:', {
      program1: program1Image,
      program2: program2Image
    });
    // 5. 🔴 NOUVEAU : Générer la recommandation intelligente
    console.log('🤖 Génération de la recommandation...');
    const smartRecommendation = generateSmartRecommendation(
      program1Metrics,
      program2Metrics,
      program1Categories,
      program2Categories,
      program1Data.budget,
      program1Data.type
    );
    console.log('✅ Recommandation générée:', smartRecommendation.conclusion);

    const optimizedProgram = createOptimizedProgram(
      program1Data,
      program2Data,
      program1Metrics,
      program2Metrics,
      program1Categories,
      program2Categories,
      program1Image,
      program2Image,
      smartRecommendation
    );
    console.log('🧠 Programme optimisé généré.');

    // 6. Préparer les données pour MongoDB
    const programs = [
      {
        id: program1Data.supabaseId,
        name: `${program1Data.destination} - Programme 1`,

        image: program1Image,
        totalCost: program1Metrics.totalCost.numericValue,
        numberOfDays: program1Metrics.numberOfDays.numericValue,
        rawData: program1Data.programme,
        metrics: program1Metrics,
        categories: program1Categories
      },
      {
        id: program2Data.supabaseId,
        name: `${program2Data.destination} - Programme 2`,
        image: program2Image,
        totalCost: program2Metrics.totalCost.numericValue,
        numberOfDays: program2Metrics.numberOfDays.numericValue,
        rawData: program2Data.programme,
        metrics: program2Metrics,
        categories: program2Categories
      }
    ];

    // 6. Préparer les données pour MongoDB
    const comparisonData = {
      programIds: [program1Data.supabaseId, program2Data.supabaseId],
      userId: userId,
      destination: program1Data.destination,
      programs: programs,  // ✅ Utiliser "programs"
      recommendation: smartRecommendation,
      optimizedProgram
    };

    console.log('📝 Structure de sauvegarde:', {
      hasPrograms: !!comparisonData.programs,
      programsLength: comparisonData.programs.length,
      hasRecommendation: !!comparisonData.recommendation
    });

    // 7. SAUVEGARDER dans MongoDB
    console.log('💾 Sauvegarde dans MongoDB...');
    const comparison = await Comparison.create(comparisonData);

    console.log('✅ Comparaison créée avec succès!');
    console.log('📝 ID:', comparison._id.toString());

    return {
      success: true,
      comparisonId: comparison._id.toString(),
      message: 'Comparaison créée avec succès',
      recommendation: smartRecommendation, // 🔴 Retourner aussi la recommandation
      optimizedProgram
    };

  } catch (error: any) {
    console.error('❌ ERREUR dans comparePrograms:', error);
    return {
      success: false,
      error: error.message || 'Erreur lors de la comparaison des programmes'
    };
  }
}