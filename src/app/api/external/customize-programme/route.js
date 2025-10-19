import { NextResponse } from 'next/server';

// POST - API pour personnaliser un programme avec l'IA
export async function POST(request) {
    try {
        const { 
            originalProgramme, 
            customPrompt, 
            modifications, 
            destination, 
            budget, 
            duration 
        } = await request.json();

        if (!originalProgramme || !customPrompt) {
            return NextResponse.json({ 
                error: 'Programme original et prompt requis' 
            }, { status: 400 });
        }

        // Simuler une réponse de l'IA (remplacer par un vrai appel OpenAI)
        const customizedProgramme = await simulateAICustomization({
            originalProgramme,
            customPrompt,
            modifications,
            destination,
            budget,
            duration
        });

        return NextResponse.json({ 
            success: true,
            customizedProgramme,
            aiResponse: {
                model: 'gpt-4',
                tokens: 150,
                cost: 0.002
            }
        });

    } catch (error) {
        console.error('❌ Erreur personnalisation IA:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

// Fonction de simulation de l'IA (à remplacer par un vrai appel OpenAI)
async function simulateAICustomization({ originalProgramme, customPrompt, modifications, destination, budget, duration }) {
    // Simulation d'un délai d'API
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Analyser le prompt pour comprendre les modifications demandées
    const promptLower = customPrompt.toLowerCase();
    
    let modifiedProgramme = { ...originalProgramme };
    
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
    
    if (promptLower.includes('budget') && promptLower.includes('réduire')) {
        const reduction = 0.8; // Réduction de 20%
        modifiedProgramme.budget = Math.round(modifiedProgramme.budget * reduction);
        modifiedProgramme.activites = modifiedProgramme.activites?.map(activite => ({
            ...activite,
            prix: Math.round(activite.prix * reduction)
        }));
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
            "Budget et activités ajustés"
        ]
    };

    return modifiedProgramme;
}

// Fonction pour appeler OpenAI (si la clé API est disponible)
async function callOpenAI({ originalProgramme, customPrompt, destination, budget, duration }) {
    // Vérifier si la clé API OpenAI est disponible
    if (!process.env.OPENAI_API_KEY) {
        console.log('⚠️ Clé API OpenAI non configurée, utilisation de la simulation');
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
