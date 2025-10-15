import { prisma } from '@/lib/prisma';

/**
 * Récupère les résultats depuis le cache
 * @param {Object} params - Critères de recherche
 * @returns {Promise<Array|null>} Résultats en cache ou null
 */
export async function getCachedSearch(params) {
  const { location, checkIn, checkOut, adults, rooms } = params;

  const cached = await prisma.hotelSearchCache.findFirst({
    where: {
      location,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      adults,
      rooms,
      expiresAt: {
        gte: new Date(), // Non expiré
      },
    },
  });

  if (cached) {
    console.log('✅ Cache HIT - Données depuis DATABASE');
    
    // Incrémenter le compteur
    await prisma.hotelSearchCache.update({
      where: { id: cached.id },
      data: { searchCount: cached.searchCount + 1 },
    });
    
    return cached.hotels;
  }

  console.log('❌ Cache MISS - Appel API nécessaire');
  return null;
}

/**
 * Stocke les résultats dans le cache
 * @param {Object} params - Critères de recherche
 * @param {Array} hotels - Résultats à cacher
 */
export async function setCachedSearch(params, hotels) {
  const { location, checkIn, checkOut, adults, rooms } = params;

  const expiresAt = new Date();
  const cacheDuration = parseInt(process.env.CACHE_DURATION_HOURS || '24');
  expiresAt.setHours(expiresAt.getHours() + cacheDuration);

  await prisma.hotelSearchCache.upsert({
    where: {
      location_checkIn_checkOut_adults_rooms: {
        location,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        adults,
        rooms,
      },
    },
    create: {
      location,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      adults,
      rooms,
      hotels,
      totalResults: hotels.length,
      expiresAt,
    },
    update: {
      hotels,
      totalResults: hotels.length,
      expiresAt,
      searchCount: 1,
    },
  });

  console.log('💾 Résultats mis en cache');
}