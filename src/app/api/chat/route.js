import axios from 'axios';

export const maxDuration = 30; 

export async function POST(req) {
  try {
    const { messages } = await req.json();

    
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY in .env.local');
    }
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${apiKey}&alt=sse`;

    
    const systemPrompt = `You are an expert AI Travel Assistant for a hotel booking platform. Your role is to:

1. Help users find the perfect hotel based on their preferences
2. Answer questions about destinations, travel tips, and accommodations
3. Provide personalized recommendations for hotels, locations, and activities
4. Be friendly, helpful, and conversational
5. When users ask about specific hotels, describe features like location, amenities, price ranges, and reviews
6. Suggest popular destinations and travel tips

Always be enthusiastic about travel and helping users plan their perfect trip!

Current available destinations include popular cities worldwide. You can help with:
- Hotel recommendations
- Destination suggestions
- Travel tips and advice
- Budget planning
- Activity suggestions
- Best times to visit

Keep responses concise but informative (2-4 sentences usually). Be conversational and warm.`;

    
    const contents = [
      { role: 'model', parts: [{ text: systemPrompt }] }, 
      ...messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
    ];

    const payload = {
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    };

    
    const response = await axios.post(apiUrl, payload, {
      responseType: 'stream', // important for streaming
      headers: { 'Content-Type': 'application/json' },
    });

    
    const stream = new ReadableStream({
      start(controller) {
        const encoder = new TextEncoder();
        let buffer = '';

        response.data.on('data', (chunk) => {
          buffer += chunk.toString();

          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; 

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const json = JSON.parse(line.slice(6));
                const text =
                  json.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
                if (text) controller.enqueue(encoder.encode(text));
              } catch {
              
              }
            }
          }
        });

        response.data.on('end', () => controller.close());
        response.data.on('error', (err) => controller.error(err));
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return Response.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}