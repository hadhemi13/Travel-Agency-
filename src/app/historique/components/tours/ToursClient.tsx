'use client'
import { useState } from 'react'
import Hero from './Hero'

interface FilterState {
    destination: string
    type: string
    priceMin: string
    priceMax: string
    duration: string
    rating: string
    tourType: string
    dateFrom: string
    dateTo: string
}

const ToursClient = () => {
    const [filters, setFilters] = useState<FilterState>({
        destination: '',
        type: '',
        priceMin: '',
        priceMax: '',
        duration: '',
        rating: '',
        tourType: '',
        dateFrom: '',
        dateTo: ''
    })

    return (
        <Hero
            filters={filters}
            setFilters={setFilters}
            totalTours={0}
            favoriteTours={0}
            showFavorites={true}
        />
    )
}

export default ToursClient