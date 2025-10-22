import TopNavBar from '@/components/TopNav/TopNavBar'
import Footer from '@/components/Footer'
import Hero from './components/Hero'
import TourCardList from './components/TourCardList'

export const metadata = {
    title: 'Tours History - Your Travel Bookings',
    description: 'View your complete travel booking history, including completed, upcoming, and cancelled tours.',
}

const HistoriquePage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#222529]">
            <TopNavBar />
            <main className="pt-20">
                <Hero />
                <TourCardList />
            </main>
            <Footer />
        </div>
    )
}

export default HistoriquePage

