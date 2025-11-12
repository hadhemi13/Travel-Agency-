import TopNavBar from '@/components/TopNav/TopNavBar'
import Footer from '@/components/Footer'
import ToursClient from '../components/tours/ToursClient'

export const metadata = {
    title: 'Favorite Tours - Your Travel Favorites',
    description: 'View your saved tours and travel favorites.',
}

const ToursFavorisPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#222529]">
            <TopNavBar />
            <main className="pt-20">
                <ToursClient />
            </main>
            <Footer />
        </div>
    )
}

export default ToursFavorisPage