// lib/imageGenerator.ts

/**
 * Génère une URL d'image pour une destination de voyage
 * Utilise Pollinations.ai (gratuit, sans clé API)
 */
export function generateTravelImageUrl(
  destination: string,
  type: string,
  additionalContext?: string,
  seed?: number
): string {
  // Créer un prompt descriptif
  const prompt = createImagePrompt(destination, type, additionalContext);
  
  // Encoder le prompt pour l'URL
  const encodedPrompt = encodeURIComponent(prompt);
  
  // ✅ Ajouter un seed unique pour chaque image
  const uniqueSeed = seed || Date.now();
  
  // URL de Pollinations.ai avec seed
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=600&nologo=true&enhance=true&seed=${uniqueSeed}`;
}

/**
 * Crée un prompt optimisé pour la génération d'image
 */
function createImagePrompt(
  destination: string,
  type: string,
  additionalContext?: string
): string {
  const typePrompts: { [key: string]: string } = {
    'Aventure': 'adventure activities, hiking trails, outdoor excitement',
    'Culturel': 'cultural landmarks, historical architecture, museums',
    'Détente': 'relaxing beach, spa resort, peaceful scenery',
    'Shopping': 'vibrant shopping district, modern stores, urban lifestyle',
    'Romantique': 'romantic sunset, couple destination, intimate atmosphere',
    'Gastronomie': 'local cuisine, traditional restaurant, food culture',
    'Nature': 'natural landscape, pristine environment, scenic views',
    'Sport': 'sports activities, athletic facilities, outdoor recreation'
  };

  const typeContext = typePrompts[type] || 'beautiful travel destination';
  
  let prompt = `Beautiful photograph of ${destination}, ${typeContext}, high quality, professional travel photography, vibrant colors, stunning scenery`;
  
  if (additionalContext) {
    prompt += `, ${additionalContext}`;
  }
  
  prompt += ', photorealistic, 8k, detailed';
  
  return prompt;
}

/**
 * Génère une image spécifique pour la comparaison
 * basée sur les métriques gagnantes
 */
export function generateComparisonImage(
  destination: string,
  type: string,
  metrics: any,
  categories: any,
  programNumber: number = 1
): string {
  // Identifier les points forts
  const highlights: string[] = [];
  
  // ✅ Ajouter une variation de perspective selon le programme
  const viewpoints = [
    'aerial view',
    'street level perspective',
    'panoramic landscape',
    'sunset golden hour',
    'vibrant daytime scene'
  ];
  
  highlights.push(viewpoints[programNumber % viewpoints.length]);
  
  if (metrics.hotel?.isWinner) {
    highlights.push(`luxury ${metrics.hotel.stars} star hotel`);
  }
  
  if (metrics.valueForMoney?.isWinner) {
    highlights.push('excellent value');
  }
  
  if (metrics.activityDiversity?.isWinner) {
    highlights.push('diverse activities');
  }
  
  // Ajouter les catégories principales
  const activeCategories = Object.entries(categories)
    .filter(([_, active]) => active)
    .map(([cat, _]) => cat)
    .slice(0, 2)
    .join(' and ');
  
  if (activeCategories) {
    highlights.push(activeCategories);
  }
  
  const additionalContext = highlights.length > 0 
    ? highlights.join(', ') 
    : undefined;
  
  // ✅ Créer un seed unique basé sur le numéro du programme
  const seed = Date.now() + (programNumber * 1000);
  
  return generateTravelImageUrl(destination, type, additionalContext, seed);
}

/**
 * Alternative : Unsplash (nécessite une clé API mais gratuit)
 */
export function generateUnsplashImageUrl(
  destination: string,
  type: string,
  programNumber: number = 1
): string {
  const query = encodeURIComponent(`${destination} ${type} travel`);
  
  // Sans clé API (limité) - ajouter un timestamp pour varier les résultats
  const timestamp = Date.now() + (programNumber * 1000);
  return `https://source.unsplash.com/800x600/?${query}&sig=${timestamp}`;
  
  // Avec clé API (recommandé pour la production)
  // const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;
  // return `https://api.unsplash.com/photos/random?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`;
}

/**
 * Précharge l'image pour éviter le délai d'affichage
 */
export async function preloadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Génère une image placeholder en cas d'erreur
 */
export function getPlaceholderImage(destination: string): string {
  const encodedDestination = encodeURIComponent(destination);
  return `https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=${encodedDestination}`;
}

/**
 * Teste si une URL d'image est valide
 */
export async function isImageUrlValid(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && (contentType?.startsWith('image/') ?? false);
  } catch {
    return false;
  }
}