import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

// Fonction pour appeler OpenAI (si la clé API est disponible)
async function callOpenAI({ originalProgramme, customPrompt, destination, budget, duration }) {
    // Vérifier si la clé API OpenAI est disponible
    if (!process.env.OPENAI_API_KEY) {
        return null;
    }

    try {
        const { OpenAI } = await import('openai');
        
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const prompt = `
        Personnalisez ce programme de voyage pour ${destination} selon la demande suivante:
        
        Demande: ${customPrompt}
        
        Programme original:
        ${JSON.stringify(originalProgramme, null, 2)}
        
        Budget: ${budget}€
        Durée: ${duration} jours
        
        Veuillez modifier le programme en gardant la structure mais en appliquant les changements demandés.
        Répondez uniquement avec le JSON du programme modifié.
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "Vous êtes un expert en voyage qui personnalise des programmes selon les demandes des clients. Répondez uniquement avec du JSON valide."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        });

        return JSON.parse(completion.choices[0].message.content);
    } catch (error) {
        console.error('❌ Erreur OpenAI:', error);
        return null;
    }
}

// Fonction de simulation de l'IA (fallback)
async function simulateAICustomization({ originalProgramme, customPrompt, modifications, destination, budget, duration }) {
    // Simulation d'un délai d'API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Analyser le prompt pour comprendre les modifications demandées
    const promptLower = customPrompt.toLowerCase();
    
    // Créer un programme de base si le programme original est vide
    let modifiedProgramme = { 
        ...originalProgramme,
        // Données de base si le programme est vide
        activites: originalProgramme.activites || [
            {
                nom: "Visite de la ville",
                description: "Découverte des principaux sites touristiques",
                duree: "3-4 heures",
                prix: 25,
                type: "tourisme"
            },
            {
                nom: "Repas local",
                description: "Dégustation de spécialités locales",
                duree: "1-2 heures",
                prix: 35,
                type: "gastronomie"
            }
        ],
        restaurants: originalProgramme.restaurants || [
            {
                nom: "Restaurant traditionnel",
                description: "Cuisine locale authentique",
                prix: 40,
                type: "traditionnel"
            }
        ],
        budget: originalProgramme.budget || budget || 500
    };
    
    // Modifications basées sur le prompt
    if (promptLower.includes('plage') || promptLower.includes('beach')) {
        modifiedProgramme.activites = modifiedProgramme.activites || [];
        modifiedProgramme.activites.push({
            nom: "Journée à la plage",
            description: "Détente et baignade",
            duree: "1 journée",
            prix: 0,
            type: "détente"
        });
    }
    
    // Gestion du budget
    if (promptLower.includes('budget')) {
        // Chercher un montant spécifique (ex: "budget à 800€", "budget 800", "800€")
        const budgetMatch = customPrompt.match(/(\d+)\s*€?/);
        if (budgetMatch) {
            const newBudget = parseInt(budgetMatch[1]);
            const oldBudget = modifiedProgramme.budget || budget;
            const ratio = newBudget / oldBudget;
            
            modifiedProgramme.budget = newBudget;
            
            // Ajuster les prix des activités proportionnellement
            if (modifiedProgramme.activites) {
                modifiedProgramme.activites = modifiedProgramme.activites.map(activite => ({
                    ...activite,
                    prix: Math.round(activite.prix * ratio)
                }));
            }
            
            // Ajuster les prix des restaurants
            if (modifiedProgramme.restaurants) {
                modifiedProgramme.restaurants = modifiedProgramme.restaurants.map(restaurant => ({
                    ...restaurant,
                    prix: Math.round(restaurant.prix * ratio)
                }));
            }
        } else if (promptLower.includes('réduire')) {
            const reduction = 0.8; // Réduction de 20%
            modifiedProgramme.budget = Math.round(modifiedProgramme.budget * reduction);
            modifiedProgramme.activites = modifiedProgramme.activites?.map(activite => ({
                ...activite,
                prix: Math.round(activite.prix * reduction)
            }));
        }
    }
    
    if (promptLower.includes('restaurant') || promptLower.includes('gastronomie')) {
        modifiedProgramme.restaurants = modifiedProgramme.restaurants || [];
        modifiedProgramme.restaurants.push({
            nom: "Restaurant gastronomique",
            description: "Expérience culinaire locale",
            prix: 50,
            type: "gastronomie"
        });
    }
    
    if (promptLower.includes('culture') || promptLower.includes('musée')) {
        modifiedProgramme.activites = modifiedProgramme.activites || [];
        modifiedProgramme.activites.push({
            nom: "Visite culturelle",
            description: "Découverte du patrimoine local",
            duree: "2-3 heures",
            prix: 15,
            type: "culture"
        });
    }

    // Ajouter les métadonnées de personnalisation
    modifiedProgramme.customizations = {
        originalPrompt: customPrompt,
        modifications: modifications,
        customizedAt: new Date().toISOString(),
        aiModel: 'gpt-4-simulation',
        changes: [
            "Programme personnalisé selon vos demandes",
            "Modifications appliquées avec l'IA",
            `Budget final: ${modifiedProgramme.budget}€`,
            `Nombre d'activités: ${modifiedProgramme.activites?.length || 0}`,
            `Nombre de restaurants: ${modifiedProgramme.restaurants?.length || 0}`
        ]
    };


    return modifiedProgramme;
}

// POST - Personnaliser un programme favori avec l'IA
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { 
            savedProgrammeId, 
            customPrompt,
            modifications 
        } = await request.json();

        if (!savedProgrammeId || !customPrompt) {
            return NextResponse.json({ 
                error: 'ID du programme et prompt de personnalisation requis' 
            }, { status: 400 });
        }

        // Récupérer le programme original
        const originalProgramme = await prisma.savedProgramme.findFirst({
            where: {
                id: savedProgrammeId,
                userId: session.user.id
            }
        });

        if (!originalProgramme) {
            return NextResponse.json({ 
                error: 'Programme non trouvé' 
            }, { status: 404 });
        }


        // Appeler l'API IA pour personnaliser le programme
        let customizedProgramme;
        try {
            // Essayer d'abord avec OpenAI
            const aiResult = await callOpenAI({
                originalProgramme: originalProgramme.programme,
                customPrompt: customPrompt,
                destination: originalProgramme.destinationName,
                budget: originalProgramme.budget,
                duration: Math.ceil((new Date(originalProgramme.endDate) - new Date(originalProgramme.startDate)) / (1000 * 60 * 60 * 24))
            });

            if (aiResult) {
                customizedProgramme = aiResult;
            } else {
                // Fallback vers la simulation
                customizedProgramme = await simulateAICustomization({
                    originalProgramme: originalProgramme.programme,
                    customPrompt: customPrompt,
                    modifications: modifications,
                    destination: originalProgramme.destinationName,
                    budget: originalProgramme.budget,
                    duration: Math.ceil((new Date(originalProgramme.endDate) - new Date(originalProgramme.startDate)) / (1000 * 60 * 60 * 24))
                });
            }
        } catch (aiError) {
            console.error('❌ Erreur API IA:', aiError);
            // Fallback: créer une version modifiée basique
            customizedProgramme = {
                ...originalProgramme.programme,
                customizations: {
                    prompt: customPrompt,
                    modifications: modifications,
                    customizedAt: new Date().toISOString()
                }
            };
        }

        // Créer le nouveau programme personnalisé avec tous les champs
        const customizedSavedProgramme = await prisma.savedProgramme.create({
            data: {
                userId: session.user.id,
                programmeId: randomUUID(), // UUID valide pour le programme personnalisé
                originalProgrammeId: originalProgramme.originalProgrammeId || originalProgramme.programmeId,
                title: `${originalProgramme.title} (Personnalisé)`,
                destinationName: originalProgramme.destinationName,
                type: originalProgramme.type,
                budget: originalProgramme.budget,
                startDate: originalProgramme.startDate,
                endDate: originalProgramme.endDate,
                voyageurs: originalProgramme.voyageurs,
                programme: customizedProgramme,
                // Nouveaux champs pour la personnalisation
                isCustom: true,
                customPrompt: customPrompt,
                parentId: originalProgramme.id
            }
        });


        return NextResponse.json({ 
            success: true,
            customizedProgramme: {
                id: customizedSavedProgramme.id,
                title: customizedSavedProgramme.title,
                customPrompt: customizedSavedProgramme.customPrompt,
                parentId: customizedSavedProgramme.parentId,
                programme: customizedSavedProgramme.programme
            }
        });

    } catch (error) {
        console.error('❌ Erreur personnalisation programme:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
