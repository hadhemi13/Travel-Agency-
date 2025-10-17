import axios from 'axios';

export async function POST(req) {
  try {
    // Get request body
    const { destination, type, startDate, endDate, budget } = await req.json();

    // Your Gemini API key
    const apiKey = process.env.GOOGLE_API_KEY;

    // Use Gemini model v2.0-flash (as in your other project)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Build request payload for Gemini
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `
Generate a ${type} trip plan for ${destination} from ${startDate} to ${endDate} with a budget of €${budget}.
Include daily activities, hotels, and flights if relevant.
Return valid JSON array of days like:
[
  { "day": 1, "activity": "Activity name", "hotel": "Hotel name", "flight": "Flight info", "cost": 100 },
  ...
]
`
            }
          ]
        }
      ]
    };

    console.log("📡 Sending request to Gemini API...");

    const response = await axios.post(apiUrl, payload);

    console.log("🌐 Raw Gemini Response:", JSON.stringify(response.data, null, 2));

    // Extract the text from Gemini response
    let textResponse = response.data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // Remove markdown code block if present
    if (textResponse.startsWith("```json")) {
      textResponse = textResponse.replace("```json", "").replace("```", "").trim();
    }

    console.log("📌 Raw AI Text:", textResponse);

    // Parse JSON safely
    let plan;
    try {
      plan = JSON.parse(textResponse);
    } catch {
      plan = textResponse; // fallback to raw text if JSON parse fails
    }

    return new Response(JSON.stringify({ plan }), { status: 200 });
  } catch (error) {
    console.error("❌ Gemini API error:", error.response?.data || error.message);
    return new Response(
      JSON.stringify({ error: error.response?.data || error.message }),
      { status: 500 }
    );
  }
}
