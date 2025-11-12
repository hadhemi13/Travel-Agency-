'use client'
import { useState } from 'react'
import Hero from './Hero'
import SavedHotelList from './SavedHotelList'

const HistoriqueClient = () => {
    const [filters, setFilters] = useState({
        city: '',
        country: '',
        priceMin: '',
        priceMax: '',
        stars: 'all',
        rating: 'all',
        hotelType: 'all',
        stayFrom: '',
        stayTo: ''
    })

    const [hotelCounts, setHotelCounts] = useState({
        total: 0,
        favorites: 0
    })

    return (
        <>
            <Hero
                filters={filters}
                setFilters={setFilters}
                totalHotels={hotelCounts.total}
                favoriteHotels={hotelCounts.favorites}
            />
            <SavedHotelList
                filters={filters}
                onCountsUpdate={setHotelCounts}
            />
        </>
    )
}

export default HistoriqueClient
