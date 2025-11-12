'use client'
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TopNavBar from '@/components/TopNav/TopNavBar';
import Footer from '@/components/Footer';
import Hero from './components/Hero';
import OurListings from './components/OurListings';
import RecommendationBanner from './components/RecommendationBanner';

const CompareListing = () => {
  const params = useParams();
  const comparisonId = params.id as string;
  const [comparison, setComparison] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComparison = async () => {
      try {
        console.log('🔍 Fetching comparison:', comparisonId);
        const res = await fetch(`/api/comparisons/${comparisonId}`);
        const data = await res.json();

        console.log('📦 Response:', data);

        if (!res.ok) {
          throw new Error(data.error || 'Erreur lors du chargement');
        }

        setComparison(data.comparison);
      } catch (err: any) {
        console.error('❌ Erreur:', err);
        setError(err.message || 'Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    };

    if (comparisonId) {
      fetchComparison();
    }
  }, [comparisonId]);

  if (loading) {
    return (
      <>
        <TopNavBar />
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#222529]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
            <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
              Chargement de la comparaison...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopNavBar />
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#222529]">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
              Erreur
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!comparison) {
    return (
      <>
        <TopNavBar />
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#222529]">
          <div className="text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              Aucune comparaison trouvée
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Cette comparaison n'existe pas ou a expiré.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopNavBar />
      <main className="pt-12 md:pt-16 bg-white dark:bg-[#222529]">
        <Hero />
        {/* Tableau de comparaison */}
        <OurListings
          compareListings={comparison.programs}
          optimizedProgram={comparison.optimizedProgram}
        />
        {/* 🔴 NOUVEAU : Afficher la recommandation si elle existe */}
        {comparison.recommendation && (
          <RecommendationBanner recommendation={comparison.recommendation} />
        )}


      </main>
      <Footer />
    </>
  );
};

export default CompareListing;