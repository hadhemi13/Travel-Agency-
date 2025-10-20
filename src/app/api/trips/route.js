import axios from 'axios';

export async function POST(req) {
  try {
    // Récupérer le corps de la requête
    const {
      destination,
      type,
      startDate,
      endDate,
      budget,
      dureeActivites,
      preferenceRepas,
      rythmeSejour
    } = await req.json();

    const apiKey = process.env.GOOGLE_API_KEY;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Prompt en français
    const prompt = `
Tu es un assistant de planification de voyage EXPERT.
L'utilisateur a rempli un formulaire avec les informations suivantes :
- Destination : ${destination}
- Type de voyage : ${type}
- Date de début : ${startDate}
- Date de fin : ${endDate}
- Budget : ${budget} €
- Durée des activités / planning journalier : ${dureeActivites}
- Préférences culinaires / restauration : ${preferenceRepas}
- Rythme du séjour : ${rythmeSejour}

IMPORTANT - RÈGLES STRICTES :
1. Tu dois suggérer un VRAI hôtel existant à ${destination}
2. Le nombre d'étoiles de l'hôtel doit correspondre à la réalité (vérifie bien)
3. Le même hôtel doit avoir le MÊME nombre d'étoiles dans TOUT le programme
4. Tous les prix doivent être réalistes pour ${destination}
5. Les distances doivent être réalistes (en km)

Génère un programme de voyage détaillé jour par jour adapté aux préférences indiquées, avec pour chaque jour :
1. Matin : activité(s) prévue(s)
2. Après-midi : activité(s) prévue(s)
3. Soir : activité(s) prévue(s)
4. Lieu à visiter : attraction principale ou quartier recommandé
5. Option de repas : en accord avec les préférences culinaires
6. Coût estimé pour la journée
7. Catégorie de chaque activité parmi : culture, nature, gastronomie, aventure, détente, shopping, vie nocturne, sport
8. Temps estimé en heures pour chaque moment (matin, après-midi, soir)
9. Distance en km parcourue durant cette journée
10. Nom et nombre d'étoiles de l'hôtel recommandé (même hôtel pour tout le séjour)

Retourne le résultat sous forme JSON valide :
[
  { "day": 1, "matin": "Activité", "apresmidi": "Activité", "soir": "Activité", "lieu": "Lieu à visiter", "repas": "Option repas", "cout": 100, "categorieActivites": { "matin": "culture", "apresmidi": "nature", "soir": "gastronomie" },
    "tempsEstime": { "matin": 2, "apresmidi": 3, "soir": 2 },
    "distanceKm": 10,
    "hotel": { "nom": "Nom de l'hôtel", "etoiles": 4 } },
  ...
]
  RAPPEL CRITIQUE : 
- Le nombre "etoiles" doit être un NOMBRE (pas une chaîne)
- L'hôtel doit être le MÊME dans tous les jours
- Vérifie que l'hôtel existe réellement à ${destination}
`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }]
    };

    console.log("📡 Envoi de la requête à Gemini...");

    const response = await axios.post(apiUrl, payload);

    console.log("🌐 Réponse brute Gemini :", JSON.stringify(response.data, null, 2));

    let textResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    if (textResponse.startsWith("```json")) {
      textResponse = textResponse.replace("```json", "").replace("```", "").trim();
    }

    console.log("📌 Texte brut AI :", textResponse);

    let plan;
    try {
      plan = JSON.parse(textResponse);
    } catch {
      plan = textResponse; // fallback si JSON invalide
    }

    return new Response(JSON.stringify({ plan }), { status: 200 });
  } catch (error) {
    console.error("❌ Erreur Gemini :", error.response?.data || error.message);
    return new Response(
      JSON.stringify({ error: error.response?.data || error.message }),
      { status: 500 }
    );
  }
}

