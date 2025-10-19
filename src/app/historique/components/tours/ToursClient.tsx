'use client'
import Hero from './Hero'

const ToursClient = () => {
    return (
        <Hero
            filters={{
                destination: '',
                type: '',
                priceMin: '',
                priceMax: ''
            }}
            setFilters={() => { }}
            totalTours={0}
            favoriteTours={0}
            showFavorites={true}
        />
    )
}

export default ToursClient