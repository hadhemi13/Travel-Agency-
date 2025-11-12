// api/trips/route.js
import axios from 'axios';

export async function POST(req) {
  try {
    const {
      destination,
      type,
      startDate,
      endDate,
      budget,
      dureeActivites,
      preferenceRepas,
      rythmeSejour,
      previousProgram
    } = await req.json();

    const apiKey = process.env.GOOGLE_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const numberOfDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const dailyBudget = Math.floor(budget / numberOfDays);

    // === STEP 1: GET 4 DIVERSE CITIES ===
    const cityPrompt = `
Suggest 4 REAL, DIVERSE cities in ${destination} for a ${type} trip.
Avoid the capital if possible.
Return ONLY a JSON array:
["City1", "City2", "City3", "City4"]
`;

    const cityResponse = await axios.post(apiUrl, {
      contents: [{ parts: [{ text: cityPrompt }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 100 }
    });

    let citiesText = cityResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    citiesText = citiesText.replace(/```json/g, '').replace(/```/g, '').trim();

    let cities = [];
    try {
      cities = JSON.parse(citiesText);
      if (!Array.isArray(cities) || cities.length < 2) throw new Error();
    } catch {
      cities = ['Madrid', 'Barcelona']; // fallback
    }

    // Remove used cities from previous program
    const usedCities = new Set();
    if (previousProgram) {
      previousProgram.forEach(d => {
        if (d.lieu) usedCities.add(d.lieu.trim());
      });
    }
    cities = cities.filter(c => !usedCities.has(c)).slice(0, 4);

    // === STEP 2: BUILD ITINERARY WITH FIXED CITIES ===
    const itineraryPrompt = `
Create a ${numberOfDays}-day ${type} itinerary in ${destination} using ONLY these cities:
${cities.join(' → ')}

Rules:
- Change city every 1-2 days
- Include realistic transport (train/bus/flight)
- Different hotel per city (same star rating)
- Daily cost: ~${dailyBudget}€ (±15%)
- Activities match theme: ${type}
- Meals: ${preferenceRepas}
- JSON only, valid

Return:
[
  {
    "day": 1,
    "matin": "...",
    "apresmidi": "...",
    "soir": "...",
    "lieu": "${cities[0]}",
    "repas": "...",
    "cout": 140,
    "categorieActivites": { "matin": "histoire", "apresmidi": "culture", "soir": "gastronomie" },
    "tempsEstime": { "matin": 3, "apresmidi": 3, "soir": 2 },
    "distanceKm": 0,
    "hotel": { "nom": "Hotel Real", "etoiles": 3 },
    "transport": "Arrival in ${cities[0]}"
  }
]
`;

    const itineraryResponse = await axios.post(apiUrl, {
      contents: [{ parts: [{ text: itineraryPrompt }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 2048 }
    });

    let text = itineraryResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const startIdx = text.indexOf('[');
    const endIdx = text.lastIndexOf(']') + 1;
    if (startIdx !== -1 && endIdx > startIdx) {
      text = text.slice(startIdx, endIdx);
    }

    let plan;
    try {
      plan = JSON.parse(text);
    } catch (e) {
      console.error("JSON Parse failed:", e);
      plan = { error: "Invalid JSON", raw: text };
    }

    return new Response(JSON.stringify({ plan, cities }), { status: 200 });

  } catch (error) {
    console.error("Gemini error:", error.response?.data || error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}