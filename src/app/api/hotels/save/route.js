import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const isValidUuid = (value) => typeof value === 'string' && UUID_REGEX.test(value);

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      id,
      hotel_id, 
      name, 
      address, 
      rating, 
      reviewCount, 
      price, 
      currency, 
      image, 
      amenities, 
      description,
      checkIn,
      checkOut,
      adults,
      rooms,
      originalHotelId
    } = body;

    // Pour les duplications, utiliser l'ID de base de données comme hotelId unique
    let finalHotelId = hotel_id;
    
    if (id && id.startsWith('duplicate_')) {
      // Pour les duplications, utiliser l'ID de base de données comme hotelId
      finalHotelId = id;
    } else {
      // Pour les hôtels normaux, vérifier s'ils existent déjà
      const existingHotel = await prisma.savedHotel.findFirst({
        where: {
          userId: session.user.id,
          hotelId: hotel_id
        }
      });

      if (existingHotel) {
        return NextResponse.json({ 
          error: 'Cet hôtel est déjà dans vos favoris',
          alreadySaved: true 
        }, { status: 400 });
      }
    }

    // Préparer les données de sauvegarde
    const hotelData = {
      userId: session.user.id,
      hotelId: finalHotelId,
      name,
      address,
      rating: parseFloat(rating) || 0,
      reviewCount: parseInt(reviewCount) || 0,
      price: parseFloat(price) || 0,
      currency: currency || 'USD',
      image,
      amenities: JSON.stringify(amenities || []),
      description: description || '',
      checkIn: checkIn ? new Date(checkIn) : null,
      checkOut: checkOut ? new Date(checkOut) : null,
      adults: adults || 1,
      rooms: rooms || 1,
      savedAt: new Date()
    };

    // Ajouter originalHotelId seulement s'il est fourni
    if (originalHotelId) {
      hotelData.originalHotelId = originalHotelId;
    }

    // Sauvegarder l'hôtel
    const savedHotel = await prisma.savedHotel.create({
      data: hotelData
    });

    return NextResponse.json({ 
      message: 'Hôtel sauvegardé avec succès',
      hotel: savedHotel 
    });

  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'hôtel:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde de l\'hôtel' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer tous les hôtels sauvegardés de l'utilisateur
    const savedHotels = await prisma.savedHotel.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        savedAt: 'desc'
      }
    });

    // Transformer les données pour le frontend
    const hotels = savedHotels.map(hotel => ({
      id: hotel.id,
      hotel_id: hotel.hotelId,
      originalHotelId: hotel.originalHotelId || null, // Gérer le cas où le champ n'existe pas encore
      name: hotel.name,
      address: hotel.address,
      rating: hotel.rating,
      reviewCount: hotel.reviewCount,
      price: hotel.price,
      currency: hotel.currency,
      image: hotel.image,
      amenities: JSON.parse(hotel.amenities || '[]'),
      description: hotel.description,
      savedDate: hotel.savedAt.toISOString().split('T')[0],
      checkIn: hotel.checkIn?.toISOString().split('T')[0],
      checkOut: hotel.checkOut?.toISOString().split('T')[0],
      adults: hotel.adults,
      rooms: hotel.rooms
    }));

    return NextResponse.json({ hotels });

  } catch (error) {
    console.error('Erreur lors de la récupération des hôtels sauvegardés:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des hôtels sauvegardés' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      id,
      hotel_id, 
      name, 
      address, 
      rating, 
      reviewCount, 
      price, 
      currency, 
      image, 
      amenities, 
      description,
      checkIn,
      checkOut,
      adults,
      rooms,
      originalHotelId
    } = body;

    if (!id && !hotel_id) {
      return NextResponse.json({ error: 'ID de l\'hôtel requis' }, { status: 400 });
    }

    // Vérifier d'abord que l'hôtel appartient à l'utilisateur
    let existingHotel = null;

    if (id && isValidUuid(id)) {
      existingHotel = await prisma.savedHotel.findFirst({
        where: {
          id: id,
          userId: session.user.id
        }
      });
    }

    if (!existingHotel && hotel_id) {
      existingHotel = await prisma.savedHotel.findFirst({
        where: {
          hotelId: hotel_id,
          userId: session.user.id
        }
      });
    }

    if (!existingHotel) {
      return NextResponse.json({ error: 'Hôtel non trouvé ou non autorisé' }, { status: 404 });
    }

    // Préparer les données de mise à jour
    const updateData = {
      name: name || existingHotel.name,
      address: address || existingHotel.address,
      rating: rating !== undefined ? parseFloat(rating) : existingHotel.rating,
      reviewCount: reviewCount !== undefined ? parseInt(reviewCount) : existingHotel.reviewCount,
      price: price !== undefined ? parseFloat(price) : existingHotel.price,
      currency: currency || existingHotel.currency,
      image: image || existingHotel.image,
      amenities: amenities ? JSON.stringify(amenities) : existingHotel.amenities,
      description: description !== undefined ? description : existingHotel.description,
      adults: adults || existingHotel.adults,
      rooms: rooms || existingHotel.rooms
    };

    // Gestion des dates
    if (checkIn && checkIn !== existingHotel.checkIn?.toISOString().split('T')[0]) {
      updateData.checkIn = new Date(checkIn);
    }
    if (checkOut && checkOut !== existingHotel.checkOut?.toISOString().split('T')[0]) {
      updateData.checkOut = new Date(checkOut);
    }

    // Gestion de originalHotelId
    if (originalHotelId !== undefined) {
      updateData.originalHotelId = originalHotelId;
    }

    console.log('Données de mise à jour:', updateData);

    // Mettre à jour l'hôtel sauvegardé
    const updatedHotel = await prisma.savedHotel.update({
      where: {
        id: existingHotel.id
      },
      data: updateData
    });

    return NextResponse.json({ 
      message: 'Hôtel modifié avec succès',
      hotel: updatedHotel 
    });

  } catch (error) {
    console.error('Erreur lors de la modification de l\'hôtel:', error);
    console.error('Détails de l\'erreur:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { 
        error: 'Erreur lors de la modification de l\'hôtel',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');

    if (!hotelId) {
      return NextResponse.json({ error: 'ID de l\'hôtel requis' }, { status: 400 });
    }

    // Supprimer l'hôtel sauvegardé en utilisant hotelId
    const result = await prisma.savedHotel.deleteMany({
      where: {
        userId: session.user.id,
        hotelId: hotelId
      }
    });

    if (result.count === 0) {
      return NextResponse.json({ error: 'Hôtel non trouvé dans vos favoris' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Hôtel supprimé des favoris' });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'hôtel:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'hôtel' },
      { status: 500 }
    );
  }
}
