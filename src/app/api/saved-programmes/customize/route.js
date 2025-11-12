function parseProgrammeData(rawProgramme) {
    if (!rawProgramme) return null;
    if (Array.isArray(rawProgramme)) return rawProgramme;
    if (typeof rawProgramme === 'string') {
        try {
            const parsed = JSON.parse(rawProgramme);
            return parseProgrammeData(parsed);
        } catch (error) {
            console.warn('⚠️ Impossible de parser le programme string, utilisation brute.', error);
            return [];
        }
    }
    if (rawProgramme?.programme) {
        return parseProgrammeData(rawProgramme.programme);
    }
    return rawProgramme;
}

function findDaysArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) {
        const dayLikeItems = value.filter(
            (item) => item && typeof item === 'object' && ('day' in item || 'jour' in item)
        );
        if (dayLikeItems.length && dayLikeItems.length === value.length) {
            return value;
        }
        for (const item of value) {
            const nested = findDaysArray(item);
            if (nested.length) {
                return nested;
            }
        }
        return [];
    }
    if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
            const result = findDaysArray(value[key]);
            if (result.length) {
                return result;
            }
        }
    }
    return [];
}

function ensureProgrammeArray(programme) {
    const parsed = parseProgrammeData(programme);
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray(parsed?.programme)) return parsed.programme;

    const convertNumericObjectToArray = (value) => {
        if (!value || typeof value !== 'object' || Array.isArray(value)) {
            return null;
        }
        const keys = Object.keys(value);
        if (!keys.length) return null;
        const numericKeys = keys.every((key) => !Number.isNaN(Number(key)));
        if (!numericKeys) return null;
        const dayObjects = keys.every((key) => {
            const entry = value[key];
            return entry && typeof entry === 'object' && ('day' in entry || 'jour' in entry);
        });
        if (!dayObjects) return null;
        return keys
            .sort((a, b) => Number(a) - Number(b))
            .map((key, index) => {
                const dayEntry = value[key];
                const normalized = { ...dayEntry };
                if (normalized.jour && !normalized.day) {
                    const parsedJour = parseInt(normalized.jour, 10);
                    if (!Number.isNaN(parsedJour)) {
                        normalized.day = parsedJour;
                    }
                }
                if (typeof normalized.day !== 'number') {
                    normalized.day = index + 1;
                }
                return normalized;
            });
    };

    const converted = convertNumericObjectToArray(parsed);
    if (converted) return converted;

    const convertedProgramme = convertNumericObjectToArray(parsed?.programme);
    if (convertedProgramme) return convertedProgramme;

    const nested = findDaysArray(parsed);
    return nested;
}

function prepareDayForGemini(originalProgramme, dayToModify) {
    const targetDay = originalProgramme.find((d) => Number(d.day) === Number(dayToModify));
    if (!targetDay) {
        throw new Error(`Jour ${dayToModify} non trouvé`);
    }
    return targetDay;
}

function normalizeDay(day, fallbackDayNumber) {
    if (!day || typeof day !== 'object') {
        throw new Error('Réponse IA invalide (format jour)');
    }
    const normalized = { ...day };
    if (normalized.jour && !normalized.day) {
        const parsedJour = parseInt(normalized.jour, 10);
        if (!Number.isNaN(parsedJour)) {
            normalized.day = parsedJour;
        }
        delete normalized.jour;
    }
    if (typeof normalized.day !== 'number') {
        const parsedDay = parseInt(normalized.day, 10);
        normalized.day = Number.isNaN(parsedDay) ? fallbackDayNumber : parsedDay;
    }
    if (!normalized.day) {
        normalized.day = fallbackDayNumber;
    }
    return normalized;
}

function mergeCustomizedDay(originalProgramme, customizedDay) {
    return originalProgramme.map((day) => {
        if (Number(day.day) !== Number(customizedDay.day)) {
            return day;
        }
        const merged = {
            ...day,
            ...customizedDay,
            day: Number(customizedDay.day),
            categorieActivites: {
                ...(day.categorieActivites || {}),
                ...(customizedDay.categorieActivites || {})
            },
            tempsEstime: {
                ...(day.tempsEstime || {}),
                ...(customizedDay.tempsEstime || {})
            },
            hotel: {
                ...(day.hotel || {}),
                ...(customizedDay.hotel || {})
            }
        };
        if (merged.cout !== undefined) {
            const parsedCout = Number(merged.cout);
            merged.cout = Number.isFinite(parsedCout) ? parsedCout : day.cout;
        } else if (day.cout !== undefined) {
            merged.cout = day.cout;
        }
        if (merged.distanceKm !== undefined) {
            const parsedDistance = Number(merged.distanceKm);
            merged.distanceKm = Number.isFinite(parsedDistance) ? parsedDistance : day.distanceKm;
        }
        // Conserver les valeurs originales si manquantes dans la réponse IA
        const keysToPreserve = ['matin', 'apresmidi', 'soir', 'lieu', 'repas', 'cout', 'distanceKm'];
        for (const key of keysToPreserve) {
            if (merged[key] === undefined) {
                merged[key] = day[key];
            }
        }
        return merged;
    });
}

function extractDayFromPrompt(customPrompt) {
    if (!customPrompt) return null;
    const patterns = [
        /jour\s+(\d+)/i,
        /day\s+(\d+)/i,
        /(\d+)(?:ème|e)\s*jour/i,
        /(\d+)(?:st|nd|rd|th)\s*day/i,
        /(?:modifier|change(?:r)?|remplacer)\s*(?:le\s+)?jour\s*(\d+)/i
    ];
    for (const pattern of patterns) {
        const match = customPrompt.match(pattern);
        if (match && match[1]) {
            const parsed = parseInt(match[1], 10);
            if (!Number.isNaN(parsed)) {
                return parsed;
            }
        }
    }
    return null;
}

function promptMentionsBudget(promptText = '') {
    if (!promptText) return false;
    const lowerPrompt = promptText.toLowerCase();
    const keywords = ['budget', 'coût', 'cout', 'prix', '€', 'eur', 'euro', 'cost', 'amount'];
    return keywords.some((keyword) => lowerPrompt.includes(keyword));
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';
import axios from 'axios';

// Fonction pour appeler Gemini via API REST
async function callGemini({ originalProgramme, customPrompt, metadata = {}, mode }) {
    const aggregatedMetadata = {
        ...(originalProgramme?.metadata || {}),
        ...metadata
    };

    let promptMode = mode;
    let programmeJson = originalProgramme;

    if (originalProgramme && typeof originalProgramme === 'object' && 'programme' in originalProgramme) {
        programmeJson = originalProgramme.programme;
        if (!promptMode) {
            promptMode = Array.isArray(programmeJson) ? 'programme' : 'day';
        }
    }

    if (!promptMode) {
        promptMode = Array.isArray(programmeJson) ? 'programme' : 'day';
    }

    // Vérifier si la clé API Gemini est disponible
    if (!process.env.GOOGLE_API_KEY) {
        console.error('❌ GOOGLE_API_KEY non configurée');
        return null;
    }

    try {
        let prompt = '';

        if (promptMode === 'day') {
            const dayJson = programmeJson;
            const dayNumber = aggregatedMetadata.dayNumber ?? dayJson?.day ?? dayJson?.jour ?? '?';
            const destination = aggregatedMetadata.destinationName || 'destination';
            const type = aggregatedMetadata.type || 'Aventure';

            prompt = `
Tu es un assistant de planification de voyage EXPERT et précis.

Voici le JOUR ${dayNumber} du programme ORIGINAL en format JSON :
${JSON.stringify(dayJson, null, 2)}

Contexte :
- Destination : ${destination}
- Type de voyage : ${type}

L'utilisateur souhaite modifier ce jour ainsi :
"${customPrompt}"

⚠️ NE MODIFIE QUE CE JOUR, NE CHANGE PAS LES AUTRES JOURS, LES BUDGETS, LES DATES OU LES ACTIVITÉS DES AUTRES JOURS.

➡️ RÈGLES :
1. Respecte exactement la même structure JSON que l'objet fourni (mêmes clés, mêmes types).
2. Assure-toi que "day" reste ${dayNumber}.
3. Si une information n'est pas mentionnée dans la demande, conserve la valeur originale.
4. Ne crée pas de texte hors JSON. Réponds UNIQUEMENT avec l'objet JSON du jour modifié.
`;
        } else {
            const programmeMetadata = originalProgramme.programme ? originalProgramme : aggregatedMetadata;
            const arrayProgramme = Array.isArray(programmeJson) ? programmeJson : [];
            const originalStartDate = programmeMetadata?.startDate 
                ? new Date(programmeMetadata.startDate) 
                : (arrayProgramme.length > 0 ? new Date() : new Date());
            const originalEndDate = programmeMetadata?.endDate 
                ? new Date(programmeMetadata.endDate) 
                : (arrayProgramme.length > 0 ? new Date() : new Date());
            const originalNumberOfDays = arrayProgramme.length > 0
                ? arrayProgramme.length
                : (programmeMetadata?.startDate && programmeMetadata?.endDate
                    ? Math.ceil((new Date(programmeMetadata.endDate) - new Date(programmeMetadata.startDate)) / (1000 * 60 * 60 * 24)) + 1
                    : 7);
            const originalBudget = programmeMetadata?.budget || 1000;
            const originalDailyBudget = Math.floor(originalBudget / Math.max(originalNumberOfDays, 1));
            const destination = programmeMetadata?.destinationName || "destination";
            const type = programmeMetadata?.type || "Aventure";

            prompt = `
Tu es un assistant de planification de voyage EXPERT et intelligent.

Voici le programme de voyage ORIGINAL en format JSON :
${JSON.stringify(programmeJson, null, 2)}

INFORMATIONS DU PROGRAMME ORIGINAL :
- Destination : ${destination}
- Type de voyage : ${type}
- Date de début : ${originalStartDate.toISOString().split('T')[0]}
- Date de fin : ${originalEndDate.toISOString().split('T')[0]}
- Budget total : ${originalBudget} €
- Nombre de jours : ${originalNumberOfDays}
- Budget par jour : environ ${originalDailyBudget}€

L'utilisateur souhaite les modifications suivantes :
"${customPrompt}"

 RÈGLE FONDAMENTALE - TU DOIS ÊTRE PRÉCIS :
 NE MODIFIE QUE CE QUI EST EXPLICITEMENT DEMANDÉ dans "${customPrompt}"
 NE MODIFIE PAS les dates, le nombre de jours, ou le nombre de nuits SAUF si c'est explicitement mentionné dans la demande
 NE MODIFIE PAS les éléments qui ne sont pas mentionnés dans la demande

➡️ TÂCHE IMPORTANTE :
1. Analyse attentivement UNIQUEMENT ce qui est demandé dans "${customPrompt}"
2. Applique SEULEMENT les modifications explicitement mentionnées

➡️ MODIFICATIONS CIBLÉES PAR JOUR :
- Si l'utilisateur mentionne un jour spécifique (ex: "jour 7", "jour 3", "le 7ème jour"), modifie UNIQUEMENT ce jour-là
- Si l'utilisateur dit "modifier le jour 7" ou "changer le programme du jour 7", modifie SEULEMENT l'objet avec "day": 7
- Les autres jours doivent rester IDENTIQUES à l'original
- Exemples de modifications de jour spécifique :
  * "Modifier le jour 7 pour ajouter une visite de musée" → modifie uniquement day: 7
  * "Changer le programme du jour 3" → modifie uniquement day: 3
  * "Jour 5 : remplacer par une journée plage" → modifie uniquement day: 5

⚠️ COMPORTEMENT DU BUDGET :
- Si l'utilisateur **ne demande pas de modifier le coût ou le budget**, garde **exactement le même budget total et les mêmes coûts journaliers**.
- Si l'utilisateur **demande explicitement de modifier le coût, les prix ou le budget**, alors :
  - Recalcule le budget total selon la nouvelle valeur demandée.
  - Ajuste les coûts journaliers proportionnellement pour que la somme totale des "cout" soit égale au nouveau budget.
  - Sinon, ne change rien au budget.

Ne change pas le budget si la demande ne contient pas de mot-clé comme :
"réduire le coût", "augmenter le budget", "changer le prix", "moins cher", "plus cher", "modifier le budget", etc.

Garde le format JSON strict et assure-toi que la somme des coûts journaliers corresponde au budget total.


➡️ MODIFICATIONS DE NOMBRE DE NUITS/JOURS :
4. Si le nombre de jours/nuits est EXPLICITEMENT mentionné (ex: "5 nuits", "5 jours", "changer à 5 nuits", "réduire à 5 jours"), alors :
   - Modifie le tableau pour avoir EXACTEMENT ce nombre de jours
   - Si on réduit : supprime les jours en trop (garde les premiers jours)
   - Si on augmente : ajoute des jours similaires aux derniers jours existants
   - Exemple : "changer à 5 nuits" → le tableau doit avoir exactement 5 éléments

➡️ MODIFICATIONS D'ACTIVITÉS :
5. Si des activités sont EXPLICITEMENT mentionnées, ajoute/modifie/supprime ces activités spécifiques
   - Si c'est pour un jour spécifique : modifie uniquement ce jour
   - Si c'est général : peut modifier plusieurs jours selon le contexte

6. Si rien n'est mentionné concernant les dates, le nombre de jours, ou le nombre de nuits → NE LES MODIFIE PAS, garde le même nombre de jours
7. CONSERVE ABSOLUMENT la structure JSON exacte du format original

🔴 CONTRAINTE BUDGÉTAIRE :
- Si l'utilisateur NE mentionne PAS le budget, les coûts journaliers ET le budget total doivent rester STRICTEMENT identiques à l'original.
- Ne change jamais les coûts ou le budget tant que la demande ne parle pas de prix, coût ou budget.
- Si, et seulement si, l'utilisateur demande explicitement un changement de budget/coût, alors :
  * Ajuste les coûts journaliers proportionnellement pour atteindre le nouveau budget total demandé.
  * Assure-toi que les coûts restent réalistes.

FORMAT STRICT REQUIS - Chaque jour DOIT avoir cette structure EXACTE :
{
  "day": 1,
  "matin": "Activité du matin",
  "apresmidi": "Activité de l'après-midi",
  "soir": "Activité du soir",
  "lieu": "Lieu à visiter ou quartier",
  "repas": "Option de repas",
  "cout": 100,
  "categorieActivites": {
    "matin": "culture",
    "apresmidi": "nature",
    "soir": "gastronomie"
  },
  "tempsEstime": {
    "matin": 2,
    "apresmidi": 3,
    "soir": 2
  },
  "distanceKm": 10,
  "hotel": {
    "nom": "Nom de l'hôtel",
    "etoiles": 4
  }
}

RÈGLES STRICTES :
- Le résultat DOIT être un tableau JSON valide : [ { day: 1, ... }, { day: 2, ... }, ... ]
- Ne change PAS les noms des clés (matin, apresmidi, soir, lieu, repas, cout, categorieActivites, tempsEstime, distanceKm, hotel)
- Chaque objet jour DOIT avoir TOUS les champs : day, matin, apresmidi, soir, lieu, repas, cout, categorieActivites, tempsEstime, distanceKm, hotel
- Le nombre "etoiles" dans hotel DOIT être un NOMBRE (pas une chaîne)
- L'hôtel doit être le MÊME dans tous les jours
- Les catégories d'activités doivent être parmi : culture, nature, gastronomie, aventure, détente, shopping, vie nocturne, sport
- 🔴 CRITIQUE : Si le nombre de jours/nuits est EXPLICITEMENT modifié dans la demande, le tableau DOIT avoir EXACTEMENT le bon nombre d'éléments
- 🔴 CRITIQUE : Si le nombre de jours/nuits N'EST PAS mentionné dans la demande, garde EXACTEMENT le même nombre de jours que l'original
- Chaque jour doit avoir un numéro "day" séquentiel (1, 2, 3, etc.)

Réponds UNIQUEMENT avec le tableau JSON modifié, sans texte supplémentaire, sans markdown, sans explications.
`;
        }

        const apiKey = process.env.GOOGLE_API_KEY;
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        console.log("📡 Envoi de la requête à Gemini...");

        const response = await axios.post(apiUrl, payload);

        console.log("🌐 Réponse brute Gemini reçue");

        let textResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

        if (!textResponse) {
            console.error("❌ Réponse Gemini vide");
            throw new Error("Réponse IA invalide");
        }

        // Nettoyer la réponse si elle contient des markdown code blocks
        if (textResponse.startsWith("```json")) {
            textResponse = textResponse.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
        } else if (textResponse.startsWith("```")) {
            textResponse = textResponse.replace(/^```\s*/, "").replace(/```\s*$/, "").trim();
        }

        // Parser le JSON
        let newProgramme;
        try {
            newProgramme = JSON.parse(textResponse);
            if (promptMode === 'day' && Array.isArray(newProgramme)) {
                newProgramme = newProgramme[0];
            }
            if (promptMode === 'day' && (!newProgramme || typeof newProgramme !== 'object')) {
                throw new Error('Réponse IA invalide (jour manquant)');
            }
        } catch (err) {
            console.error("Erreur JSON Gemini :", err);
            console.error("Réponse brute Gemini :", textResponse);
            throw new Error("Réponse IA invalide");
        }
        return newProgramme;
    } catch (error) {
        console.error('❌ Erreur Gemini:', error.response?.data || error.message);
        return null;
    }
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
            day
        } = await request.json();

        if (!savedProgrammeId || !customPrompt) {
            return NextResponse.json({
                error: 'ID du programme et prompt de personnalisation requis'
            }, { status: 400 });
        }

        const userRequestedBudgetChange = promptMentionsBudget(customPrompt);

        let dayNumber = day !== undefined && day !== null ? parseInt(day, 10) : NaN;
        if (Number.isNaN(dayNumber) || dayNumber <= 0) {
            const extractedDay = extractDayFromPrompt(customPrompt);
            if (!extractedDay) {
                return NextResponse.json({
                    error: 'Numéro de jour invalide ou introuvable dans le prompt'
                }, { status: 400 });
            }
            dayNumber = extractedDay;
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

        const programmeArray = ensureProgrammeArray(originalProgramme.programme);
        const originalCostTotal = programmeArray.reduce((sum, day) => {
            if (!day) return sum;
            const value = Number(day.cout);
            return Number.isFinite(value) ? sum + value : sum;
        }, 0);

        if (!programmeArray.length) {
            return NextResponse.json({
                error: 'Programme original vide ou invalide'
            }, { status: 400 });
        }

        let customizedDay;
        try {
            const dayToModify = prepareDayForGemini(programmeArray, dayNumber);

            const aiResponse = await callGemini({
                originalProgramme: dayToModify,
                customPrompt,
                metadata: {
                    destinationName: originalProgramme.destinationName,
                    type: originalProgramme.type,
                    dayNumber
                },
                mode: 'day'
            });

            if (!aiResponse) {
                return NextResponse.json({ error: "Réponse IA invalide" }, { status: 400 });
            }

            customizedDay = normalizeDay(aiResponse, dayNumber);

            if (!userRequestedBudgetChange && dayToModify && dayToModify.cout !== undefined) {
                customizedDay.cout = dayToModify.cout;
            }
        } catch (aiError) {
            console.error('❌ Erreur IA lors de la personnalisation du jour:', aiError);
            return NextResponse.json({ error: "Réponse IA invalide" }, { status: 400 });
        }

        let newProgramme = mergeCustomizedDay(programmeArray, customizedDay);

        if (!userRequestedBudgetChange) {
            newProgramme = newProgramme.map((day) => {
                const originalDay = programmeArray.find(
                    (original) => Number(original?.day) === Number(day?.day)
                );
                if (!originalDay) return day;
                return {
                    ...day,
                    ...(originalDay.cout !== undefined ? { cout: originalDay.cout } : {}),
                };
            });
        }

        const computedBudget = newProgramme.reduce((sum, day) => {
            if (!day) return sum;
            const coutValue = Number(day.cout);
            return Number.isFinite(coutValue) ? sum + coutValue : sum;
        }, 0);

        const costsHaveChanged = Math.abs(computedBudget - originalCostTotal) > 0.01;

        let baseBudget = originalProgramme.budget;
        if (!userRequestedBudgetChange) {
            if (originalProgramme.originalProgrammeId) {
                const sourceProgramme =
                    (await prisma.programmesVoyage.findUnique({
                        where: { id: originalProgramme.originalProgrammeId }
                    })) ||
                    (await prisma.savedProgramme.findUnique({
                        where: { id: originalProgramme.originalProgrammeId }
                    }));

                if (sourceProgramme?.budget) {
                    baseBudget = sourceProgramme.budget;
                }
            } else if (originalProgramme.parentId) {
                const parentProgramme = await prisma.savedProgramme.findUnique({
                    where: { id: originalProgramme.parentId }
                });
                if (parentProgramme?.budget) {
                    baseBudget = parentProgramme.budget;
                }
            }
        }

        const finalBudget = userRequestedBudgetChange
            ? (computedBudget > 0 ? computedBudget : (baseBudget ?? originalProgramme.budget))
            : (baseBudget ?? originalProgramme.budget);

        const customizedSavedProgramme = await prisma.savedProgramme.create({
            data: {
                userId: session.user.id,
                programmeId: randomUUID(),
                originalProgrammeId: originalProgramme.originalProgrammeId || originalProgramme.programmeId,
                title: `${originalProgramme.title} (Personnalisé - Jour ${dayNumber})`,
                destinationName: originalProgramme.destinationName,
                type: originalProgramme.type,
                budget: finalBudget,
                startDate: originalProgramme.startDate,
                endDate: originalProgramme.endDate,
                voyageurs: originalProgramme.voyageurs,
                programme: newProgramme,
                imageUrl: originalProgramme.imageUrl,
                isCustom: true,
                customPrompt: customPrompt,
                parentId: originalProgramme.id
            }
        });

        console.log(`✅ Jour ${dayNumber} personnalisé pour le programme ${savedProgrammeId}`);

        return NextResponse.json({
            success: true,
            message: `Jour ${dayNumber} personnalisé avec succès`,
            customizedProgramme: {
                id: customizedSavedProgramme.id,
                programmeId: customizedSavedProgramme.programmeId,
                title: customizedSavedProgramme.title,
                destinationName: customizedSavedProgramme.destinationName,
                destination: customizedSavedProgramme.destinationName,
                type: customizedSavedProgramme.type,
                budget: customizedSavedProgramme.budget,
                startDate: customizedSavedProgramme.startDate,
                endDate: customizedSavedProgramme.endDate,
                voyageurs: customizedSavedProgramme.voyageurs,
                isCustom: customizedSavedProgramme.isCustom,
                customPrompt: customizedSavedProgramme.customPrompt,
                parentId: customizedSavedProgramme.parentId,
                originalProgrammeId: customizedSavedProgramme.originalProgrammeId,
                programme: customizedSavedProgramme.programme,
                imageUrl: customizedSavedProgramme.imageUrl
            }
        });

    } catch (error) {
        console.error('❌ Erreur personnalisation programme:', error);
        return NextResponse.json({ error: 'Erreur IA : ' + error.message }, { status: 500 });
    }
}
