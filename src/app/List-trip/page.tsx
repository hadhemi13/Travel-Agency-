'use client';
import { useState } from 'react';
import TopNavBar from '@/components/TopNav/TopNavBar'
import Footer from '@/components/Footer'
import Hero from './Hero'
import ProgrammesList from './ProgrammesList'

const ListTripPage = () => {
    const [activeFilter, setActiveFilter] = useState("all");

    const handleFilterChange = (filter: string) => {
        setActiveFilter(filter);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#222529]">
            <TopNavBar />
            <main className="pt-20">
                {/* Hero Section avec filtres */}
                <Hero onFilterChange={handleFilterChange} />

                {/* Section des programmes sauvegardés */}
                <section className="max-w-7xl mx-auto py-12 px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
                            <strong>Vos Programmes Sauvegardés</strong>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Découvrez vos itinéraires personnalisés générés par l'IA
                        </p>
                    </div>

                    <ProgrammesList filter={activeFilter} />
                </section>
            </main>
            <Footer />
        </div>
    )
}

export default ListTripPage
