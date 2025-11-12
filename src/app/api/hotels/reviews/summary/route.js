// src/app/api/hotels/reviews/summary/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export const maxDuration = 30;

export async function POST(req) {
  try {
    const { reviews, hotelName } = await req.json();

    if (!reviews || reviews.length === 0) {
      return NextResponse.json(
        { error: 'No reviews provided' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.error('Missing GOOGLE_GENERATIVE_AI_API_KEY in .env.local');
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 500 }
      );
    }

    // Prepare reviews text (first 25)
    const reviewsText = reviews
      .slice(0, 25)
      .map((review) => {
        const pros = review.pros || '';
        const cons = review.cons || '';
        const score = review.average_score || 'N/A';
        return `Score: ${score}/4\nPositive: ${pros}\nNegative: ${cons}`;
      })
      .join('\n\n---\n\n');

    console.log('Generating AI summary for:', hotelName, `(${reviews.length} reviews)`);

    // Construct prompt
    const prompt = `You are a helpful travel assistant analyzing hotel reviews.

Hotel: ${hotelName}

Reviews to analyze:
${reviewsText}

Please provide a concise summary with the following sections:

**Overall Impression:** (2-3 sentences about the general guest experience)

**Main Strengths:** (3-5 bullet points of the most praised aspects)

**Common Concerns:** (3-5 bullet points of the most mentioned issues)

**Best For:** (1-2 sentences about who would enjoy this hotel most)

Keep the summary professional, balanced, and helpful for travelers making a decision.`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?key=${apiKey}&alt=sse`;

    const payload = {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      },
    };

    // Make streaming API call
    const response = await axios.post(apiUrl, payload, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'stream', // Critical for SSE
      timeout: 28_000,
    });

    let fullText = '';

    // Parse SSE stream
    const stream = response.data;
    const chunks = [];

    for await (const chunk of stream) {
      const lines = chunk.toString().split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const json = JSON.parse(line.slice(6));
            const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              chunks.push(text);
            }
          } catch (e) {
            // Ignore JSON parse errors in stream
          }
        }
      }
    }

    fullText = chunks.join('').trim();

    // Final fallback if empty
    if (!fullText) {
      console.warn('Empty response from Gemini streaming API');
      fullText = `Guests have shared feedback about ${hotelName}. Common themes include location, cleanliness, and service.`;
    }

    console.log('AI summary generated successfully (length:', fullText.length + ')');

    return NextResponse.json({
      success: true,
      summary: fullText,
      reviewCount: reviews.length,
    });
  } catch (error) {
    console.error('Error generating AI summary:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
    });

    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      'Failed to generate AI summary';

    return NextResponse.json(
      { error: errorMessage },
      { status: error.response?.status || 500 }
    );
  }
}