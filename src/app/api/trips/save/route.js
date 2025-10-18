import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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

    // Save the program to database WITHOUT destination relation
 // Save the program to database WITH destination name
const savedProgram = await prisma.programmesVoyage.create({
  data: {
    userId: session.user.id,
    destinationName: destination,  // Add this line
    type: type,
    budget: parseFloat(budget),
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    voyageurs: parseInt(voyageurs) || 1,
    programme: programme,
  }
});

    console.log('✅ Programme enregistré:', savedProgram.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Programme enregistré avec succès !',
        programId: savedProgram.id,
        userId: session.user.id,
        destination: destination
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