// src/app/api/hotels/reviews/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const hotelId = searchParams.get('hotelId');

    if (!hotelId) {
      return NextResponse.json({ error: 'Missing hotelId' }, { status: 400 });
    }

    // Fetch reviews from Booking.com API
    const response = await axios.get(
      'https://booking-com15.p.rapidapi.com/api/v1/hotels/getHotelReviews',
      {
        params: {
          hotel_id: hotelId,
          locale: 'en-gb',
          sort_type: 'sort_most_relevant',
          page_number: 1, // First page only for summary
        },
        headers: {
          'x-rapidapi-host': 'booking-com15.p.rapidapi.com',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        },
      }
    );

    console.log('📝 Reviews fetched:', response.data?.data?.result?.length || 0);

    if (!response.data?.status) {
      throw new Error('Failed to fetch reviews');
    }

    return NextResponse.json({
      success: true,
      reviews: response.data.data.result || [],
      count: response.data.data.count || 0,
    });
  } catch (error) {
    console.error('❌ Error fetching reviews:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}