import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import path from 'path';
import { promises as fs } from 'fs';
import { generateTravelImageUrl } from '@/lib/imageGenerator';

export const runtime = 'nodejs';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'assets', 'images', 'programmes');

async function saveProgrammeImage(destination, type) {
  try {
    const imageUrl = generateTravelImageUrl(destination, type);
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Réponse invalide ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await fs.mkdir(IMAGES_DIR, { recursive: true });

    const contentType = response.headers.get('content-type') || '';
    const extension = contentType.includes('png') ? 'png' : 'jpg';

    const safeDestination = destination
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || 'programme';

    const fileName = `${safeDestination}-${Date.now()}.${extension}`;
    const filePath = path.join(IMAGES_DIR, fileName);

    await fs.writeFile(filePath, buffer);

    return `/assets/images/programmes/${fileName}`;
  } catch (error) {
    console.error('❌ Erreur sauvegarde image IA:', error);
    return null;
  }
}

export async function POST(req) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    
    console.log('🔐 Session:', session);

    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ 
          error: 'Non authentifié. Veuillez vous connecter pour enregistrer un programme.' 
        }),
        { status: 401 }
      );
    }

    // Get request body
    const { 
      destination, 
      type, 
      budget, 
      startDate, 
      endDate, 
      voyageurs,
      programme 
    } = await req.json();

    console.log('📥 Données reçues:', { 
      destination, 
      type, 
      budget, 
      startDate, 
      endDate, 
      voyageurs,
      userId: session.user.id 
    });

    // Validate required fields
    if (!destination || !type || !budget || !startDate || !endDate || !programme) {
      return new Response(
        JSON.stringify({ error: 'Données manquantes' }),
        { status: 400 }
      );
    }

    const storedImageUrl = await saveProgrammeImage(destination, type);

    const savedProgram = await prisma.programmesVoyage.create({
      data: {
        userId: session.user.id,
        destinationName: destination,
        type: type,
        budget: parseFloat(budget),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        voyageurs: parseInt(voyageurs) || 1,
        programme: programme,
        imageUrl: storedImageUrl,
        categoriesActivites: programme.map(day => day.categorieActivites || {}),
        tempsEstime: programme.map(day => day.tempsEstime || {}),
        distancesKm: programme.map(day => day.distanceKm || 0),
        hotelInfo: programme[0]?.hotel || null,
      }
    });

    console.log('✅ Programme enregistré:', savedProgram.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Programme enregistré avec succès !',
        programId: savedProgram.id,
        userId: session.user.id,
        destination: destination,
        imageUrl: storedImageUrl
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de l\'enregistrement du programme',
        details: error.message 
      }),
      { status: 500 }
    );
  }
}