import TopNavBar from '@/components/TopNav/TopNavBar'
import Footer from '@/components/Footer'
import HistoriqueClient from '../components/hotels/HistoriqueClient'

export const metadata = {
    title: 'Saved Hotels - Your Travel Favorites',
    description: 'View your saved hotels and travel favorites.',
}

const HistoriquePage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#222529]">
            <TopNavBar />
            <main className="pt-20">
                <HistoriqueClient />
            </main>
            <Footer />
        </div>
    )
}

export default HistoriquePage

