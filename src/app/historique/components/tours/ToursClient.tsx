'use client'
import Hero from './Hero'

const ToursClient = () => {
    return (
        <Hero
            filters={{
                destination: '',
                type: '',
                priceMin: '',
                priceMax: '',
                status: '',
                duration: '',
                travelFrom: '',
                travelTo: ''
            }}
            setFilters={() => { }}
            totalTours={0}
            favoriteTours={0}
        />
    )
}

export default ToursClient
