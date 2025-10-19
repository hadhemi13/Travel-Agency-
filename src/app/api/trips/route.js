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
Tu es un assistant de planification de voyage.
L'utilisateur a rempli un formulaire avec les informations suivantes :
- Destination : ${destination}
- Type de voyage : ${type}
- Date de début : ${startDate}
- Date de fin : ${endDate}
- Budget : ${budget} €
- Durée des activités / planning journalier : ${dureeActivites}
- Préférences culinaires / restauration : ${preferenceRepas}
- Rythme du séjour : ${rythmeSejour}

Génère un programme de voyage détaillé jour par jour adapté aux préférences indiquées, avec pour chaque jour :
1. Matin : activité(s) prévue(s)
2. Après-midi : activité(s) prévue(s)
3. Soir : activité(s) prévue(s)
4. Lieu à visiter : attraction principale ou quartier recommandé
5. Option de repas : en accord avec les préférences culinaires
6. Coût estimé pour la journée

Retourne le résultat sous forme JSON valide :
[
  { "day": 1, "matin": "Activité", "apresmidi": "Activité", "soir": "Activité", "lieu": "Lieu à visiter", "repas": "Option repas", "cout": 100 },
  ...
]
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

