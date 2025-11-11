'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FaPlane,
  FaCalendarAlt,
  FaEuroSign,
  FaSun,
  FaCloudSun,
  FaMoon,
  FaMapMarkedAlt,
  FaSave,
  FaMagic,
  FaCheck,
  FaChartBar,
} from 'react-icons/fa';
import TopNavBar from '@/components/TopNav/TopNavBar';
import { comparePrograms } from '@/actions/comparePrograms';

interface TripProgram {
  day: number;
  morning?: string;
  afternoon?: string;
  evening?: string;
  places?: string;
  flight?: string;
  cost: number;
  categorieActivites?: { matin?: string; apresmidi?: string; soir?: string };
  tempsEstime?: { matin?: number; apresmidi?: number; soir?: number };
  distanceKm?: number;
  hotel?: { nom: string; etoiles: number };
}

export default function TripResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [programs, setPrograms] = useState<TripProgram[][]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedProgram, setSavedProgram] = useState<number | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [programSupabaseIds, setProgramSupabaseIds] = useState<(string | null)[]>([]);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareError, setCompareError] = useState<string | null>(null);
  const [isSavedProgram, setIsSavedProgram] = useState(false);

  const initialDestination = searchParams.get('destination') || '';
  const initialType = searchParams.get('typeVoyage') || 'Aventure';
  const initialStartDate = searchParams.get('dateDebut') || '';
  const initialEndDate = searchParams.get('dateFin') || '';
  const initialBudget = Number(searchParams.get('budget') || 0);
  const initialVoyageurs = Number(searchParams.get('voyageurs') || 1);
  const dureeActivites = searchParams.get('dureeActivites') || '';
  const preferenceRepas = searchParams.get('preferenceRepas') || '';
  const rythmeSejour = searchParams.get('rythmeSejour') || '';

  const [destination, setDestination] = useState(initialDestination);
  const [type, setType] = useState(initialType);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [budget, setBudget] = useState(initialBudget);
  const [voyageurs, setVoyageurs] = useState(initialVoyageurs);

  useEffect(() => {
    setDestination(initialDestination);
    setType(initialType);
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
    setBudget(initialBudget);
    setVoyageurs(initialVoyageurs);
  }, [initialDestination, initialType, initialStartDate, initialEndDate, initialBudget, initialVoyageurs]);

  // Load theme
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setDarkMode(true);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Empêche le double appel automatique
  const hasFetched = useRef(false);

  // Fetch first program once when the page loads
  useEffect(() => {
    if (!hasFetched.current && destination) {
      hasFetched.current = true;
      // Check if this is a saved program by looking for a programmeId in URL
      const programmeId = searchParams.get('programmeId');
      if (programmeId) {
        setIsSavedProgram(true);
        fetchSavedProgram(programmeId);
      } else {
        setIsSavedProgram(false);
        fetchItinerary();
      }
    }
  }, [destination]);

  const fetchSavedProgram = async (programmeId: string) => {
    setLoading(true);
    try {
      const fetchProgramme = async (url: string) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return null;
          const data = await res.json();
          return data?.programme || null;
        } catch (error) {
          console.warn(`⚠️ Impossible de récupérer le programme via ${url}`, error);
          return null;
        }
      };

      // Essayer d'abord via saved-programmes (préférence pour les personnalisations/favoris)
      let savedProgram = await fetchProgramme(`/api/saved-programmes/${programmeId}`);

      // Si pas trouvé, tenter via programmes (programme généré initial)
      if (!savedProgram) {
        savedProgram = await fetchProgramme(`/api/programmes/${programmeId}`);
      }

      // Dernier recours : requête GET /api/saved-programmes?programmeId=
      if (!savedProgram) {
        savedProgram = await fetchProgramme(`/api/saved-programmes?programmeId=${programmeId}`);
      }

      if (!savedProgram) {
        console.error('❌ Programme sauvegardé non trouvé (toutes sources)');
        fetchItinerary();
        return;
      }

      if (!Array.isArray(savedProgram)) {
        const meta = savedProgram as any;
        if (meta.destinationName || meta.destination) {
          setDestination(meta.destinationName || meta.destination || destination);
        }
        if (meta.type) {
          setType(meta.type);
        }
        if (meta.startDate) {
          const iso = new Date(meta.startDate).toISOString().split('T')[0];
          setStartDate(iso);
        }
        if (meta.endDate) {
          const iso = new Date(meta.endDate).toISOString().split('T')[0];
          setEndDate(iso);
        }
        if (meta.budget !== undefined && meta.budget !== null) {
          const parsedBudget = Number(meta.budget);
          if (!Number.isNaN(parsedBudget)) {
            setBudget(parsedBudget);
          }
        }
        if (meta.voyageurs) {
          const parsedVoyageurs = Number(meta.voyageurs);
          if (!Number.isNaN(parsedVoyageurs)) {
            setVoyageurs(parsedVoyageurs);
          }
        }
      }

      const daysArray = Array.isArray(savedProgram?.programme)
        ? savedProgram.programme
        : Array.isArray(savedProgram)
          ? savedProgram
          : Array.isArray(savedProgram?.programme?.programme)
            ? savedProgram.programme.programme
            : [];

      if (!Array.isArray(daysArray) || daysArray.length === 0) {
        console.error('⚠️ Programme sans jours, fallback sur génération IA');
        fetchItinerary();
        return;
      }

      const formatted: TripProgram[] = daysArray.map((item: any, index: number) => ({
        day: item.day ?? item.jour ?? index + 1,
        morning: item.matin || item.morning || '',
        afternoon: item.apresmidi || item.afternoon || '',
        evening: item.soir || item.evening || '',
        places: item.lieu || item.places || '',
        flight: item.flight || '',
        cost: item.cout ?? item.cost ?? 0,
        categorieActivites: item.categorieActivites || {},
        tempsEstime: item.tempsEstime || {},
        distanceKm: item.distanceKm ?? 0,
        hotel: item.hotel || null
      }));

      setPrograms([formatted]);
      setProgramSupabaseIds([savedProgram.id || savedProgram.programmeId || programmeId]);
    } catch (err) {
      console.error('❌ Erreur récupération programme sauvegardé:', err);
      // Fallback: générer un programme basique
      fetchItinerary();
    } finally {
      setLoading(false);
    }
  };

  const fetchItinerary = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          type,
          startDate,
          endDate,
          budget,
          dureeActivites,
          preferenceRepas,
          rythmeSejour,
        }),
      });
      const data = await res.json();

      const formatted: TripProgram[] = (Array.isArray(data.plan) ? data.plan : []).map(
        (item: any) => ({
          day: item.day,
          morning: item.matin || '',
          afternoon: item.apresmidi || '',
          evening: item.soir || '',
          places: item.lieu || '',
          flight: item.flight || '',
          cost: item.cout || 0,
          categorieActivites: item.categorieActivites || {},
          tempsEstime: item.tempsEstime || {},
          distanceKm: item.distanceKm || 0,
          hotel: item.hotel || null
        })
      );

      setPrograms((prev) => [...prev, formatted]);
      // Add null for new unsaved program
      setProgramSupabaseIds((prev) => [...prev, null]);
    } catch (err) {
      console.error('❌ Erreur récupération itinéraire:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnother = () => fetchItinerary();

  const handleSaveProgram = async (programIndex: number) => {
    setSaveLoading(true);
    setSaveError(null);

    try {
      // Get the program to save
      const programToSave = programs[programIndex];

      // Convert the program back to the original format for saving
      const formattedProgram = programToSave.map((day) => ({
        day: day.day,
        matin: day.morning || '',
        apresmidi: day.afternoon || '',
        soir: day.evening || '',
        lieu: day.places || '',
        repas: '',
        cout: day.cost,
        categorieActivites: day.categorieActivites || {},
        tempsEstime: day.tempsEstime || {},
        distanceKm: day.distanceKm || 0,
        hotel: day.hotel || null
      }));

      const response = await fetch('/api/trips/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          type,
          budget,
          startDate,
          endDate,
          voyageurs,
          programme: formattedProgram,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'enregistrement');
      }

      // Success
      setSavedProgram(programIndex + 1);
      setShowSaveModal(true);

      // Update Supabase IDs
      const newIds = [...programSupabaseIds];
      newIds[programIndex] = data.programId;
      setProgramSupabaseIds(newIds);

    } catch (error: any) {
      console.error('❌ Erreur sauvegarde:', error);
      setSaveError(error.message || 'Erreur lors de l\'enregistrement du programme');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSaveModal(false);
    setSaveError(null);
  };

  const handleComparePrograms = async () => {
    console.log('🎯 DÉBUT handleComparePrograms');
    console.log('📊 Nombre de programmes:', programs.length);
    console.log('🔑 IDs Supabase avant sauvegarde:', programSupabaseIds);

    // Vérifier qu'on a bien 2 programmes
    if (programs.length < 2) {
      console.log('❌ Pas assez de programmes');
      setCompareError("Vous devez générer au moins 2 programmes pour les comparer");
      return;
    }

    setCompareLoading(true);
    setCompareError(null);

    try {
      // 🔴 ÉTAPE 1: SAUVEGARDER LES PROGRAMMES NON SAUVEGARDÉS
      const savedIds = [...programSupabaseIds];

      // Sauvegarder le programme 1 si pas encore sauvegardé
      if (!savedIds[0]) {
        console.log('💾 Sauvegarde du programme 1...');
        const formattedProgram1 = programs[0].map((day) => ({
          day: day.day,
          matin: day.morning || '',
          apresmidi: day.afternoon || '',
          soir: day.evening || '',
          lieu: day.places || '',
          repas: '',
          cout: day.cost,
          categorieActivites: day.categorieActivites || {},
          tempsEstime: day.tempsEstime || {},
          distanceKm: day.distanceKm || 0,
          hotel: day.hotel || null
        }));

        const response1 = await fetch('/api/trips/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination,
            type,
            budget,
            startDate,
            endDate,
            voyageurs,
            programme: formattedProgram1,
          }),
        });

        const data1 = await response1.json();
        if (!response1.ok) {
          throw new Error(`Erreur sauvegarde Programme 1: ${data1.error}`);
        }

        savedIds[0] = data1.programId;
        console.log('✅ Programme 1 sauvegardé:', savedIds[0]);
      } else {
        console.log('✅ Programme 1 déjà sauvegardé:', savedIds[0]);
      }

      // Sauvegarder le programme 2 si pas encore sauvegardé
      if (!savedIds[1]) {
        console.log('💾 Sauvegarde du programme 2...');
        const formattedProgram2 = programs[1].map((day) => ({
          day: day.day,
          matin: day.morning || '',
          apresmidi: day.afternoon || '',
          soir: day.evening || '',
          lieu: day.places || '',
          repas: '',
          cout: day.cost,
          categorieActivites: day.categorieActivites || {},
          tempsEstime: day.tempsEstime || {},
          distanceKm: day.distanceKm || 0,
          hotel: day.hotel || null
        }));

        const response2 = await fetch('/api/trips/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination,
            type,
            budget,
            startDate,
            endDate,
            voyageurs,
            programme: formattedProgram2,
          }),
        });

        const data2 = await response2.json();
        if (!response2.ok) {
          throw new Error(`Erreur sauvegarde Programme 2: ${data2.error}`);
        }

        savedIds[1] = data2.programId;
        console.log('✅ Programme 2 sauvegardé:', savedIds[1]);
      } else {
        console.log('✅ Programme 2 déjà sauvegardé:', savedIds[1]);
      }

      // Mettre à jour l'état avec les nouveaux IDs
      setProgramSupabaseIds(savedIds);

      console.log('🔑 IDs après sauvegarde:', savedIds);

      // 🔴 ÉTAPE 2: PRÉPARER LES DONNÉES POUR LA COMPARAISON
      const program1Data = {
        supabaseId: savedIds[0],
        destination,
        type,
        budget,
        startDate,
        endDate,
        voyageurs,
        programme: programs[0].map(day => ({
          day: day.day,
          matin: day.morning || '',
          apresmidi: day.afternoon || '',
          soir: day.evening || '',
          lieu: day.places || '',
          repas: '',
          cout: day.cost,
          categorieActivites: day.categorieActivites || {},
          tempsEstime: day.tempsEstime || {},
          distanceKm: day.distanceKm || 0,
          hotel: day.hotel || null
        }))
      };

      const program2Data = {
        supabaseId: savedIds[1],
        destination,
        type,
        budget,
        startDate,
        endDate,
        voyageurs,
        programme: programs[1].map(day => ({
          day: day.day,
          matin: day.morning || '',
          apresmidi: day.afternoon || '',
          soir: day.evening || '',
          lieu: day.places || '',
          repas: '',
          cout: day.cost,
          categorieActivites: day.categorieActivites || {},
          tempsEstime: day.tempsEstime || {},
          distanceKm: day.distanceKm || 0,
          hotel: day.hotel || null
        }))
      };

      console.log('📦 Données prêtes pour comparaison');
      console.log('🚀 Appel de comparePrograms...');

      // 🔴 ÉTAPE 3: COMPARER LES PROGRAMMES
      const result = await comparePrograms(program1Data, program2Data);

      console.log('📨 Résultat comparePrograms:', result);

      if (result.success) {
        console.log('✅ Comparaison réussie, redirection vers:', `/travel-comparator/${result.comparisonId}`);
        router.push(`/travel-comparator/${result.comparisonId}`);
      } else {
        console.log('❌ Échec comparaison:', result.error);
        setCompareError(result.error || "Erreur lors de la comparaison");
      }
    } catch (error: any) {
      console.error('❌ EXCEPTION dans handleComparePrograms:', error);
      console.error('Stack:', error.stack);
      setCompareError(error.message || "Erreur lors de la comparaison");
    } finally {
      setCompareLoading(false);
    }
  };

  return (
    <div
      className={`${darkMode ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'
        } min-h-screen transition-colors duration-500`}
    >
      <TopNavBar />

      {/* Hero Section */}
      <section
        className="relative w-full py-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/assets/images/bg/08.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-4 relative z-10 flex justify-center">
          <div className="max-w-3xl w-full bg-white dark:bg-[#19222b] rounded-3xl p-8 backdrop-blur-md shadow-2xl text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              {destination || 'Destination non spécifiée'}
            </h1>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {startDate && endDate && (
                <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow">
                  {startDate} → {endDate}
                </span>
              )}
              <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow">
                {type}
              </span>
            </div>
            <div className="inline-block bg-gradient-to-r from-purple-700 to-blue-700 text-white font-bold px-6 py-3 rounded-full shadow-lg text-lg">
              Budget total : €{budget}
            </div>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center mt-10">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
            <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
              Génération de votre itinéraire magique...
            </p>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {saveError && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-400 text-red-700 dark:text-red-300 px-6 py-4 rounded-xl shadow-lg">
            <p className="font-bold text-lg mb-1">⚠️ Erreur</p>
            <p>{saveError}</p>
          </div>
        </div>
      )}

      {compareError && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <div className="bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-400 text-orange-700 dark:text-orange-300 px-6 py-4 rounded-xl shadow-lg">
            <p className="font-bold text-lg mb-1">⚠️ Erreur de comparaison</p>
            <p>{compareError}</p>
          </div>
        </div>
      )}

      {/* Programs Display */}
      {programs.map((program, index) => (
        <section
          key={index}
          className="max-w-6xl mx-auto py-12 px-4"
        >
          {program.length > 0 ? (
            <>
              {/* Program Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                  Programme {index + 1}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Votre itinéraire personnalisé pour {destination}
                </p>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {program.map((day) => (
                  <div
                    key={day.day}
                    className="bg-white dark:bg-[#19222b] rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-2xl hover:scale-[1.02] duration-300"
                  >
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 flex justify-between items-center">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <FaCalendarAlt /> Jour {day.day}
                      </h3>
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                        Itinéraire
                      </span>
                    </div>

                    <div className="p-6 space-y-5">
                      <div className="flex items-start gap-3">
                        <FaSun className="text-yellow-500 mt-1 text-xl" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Matin</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {day.morning || 'Aucune activité prévue'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FaCloudSun className="text-orange-500 mt-1 text-xl" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Après-midi</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {day.afternoon || 'Aucune activité prévue'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FaMoon className="text-indigo-500 mt-1 text-xl" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Soir</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {day.evening || 'Aucune activité prévue'}
                          </p>
                        </div>
                      </div>

                      {day.places && (
                        <div className="flex items-start gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <FaMapMarkedAlt className="text-green-600 mt-1 text-xl" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Lieux à visiter</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {day.places}
                            </p>
                          </div>
                        </div>
                      )}

                      {day.flight && (
                        <div className="flex items-start gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <FaPlane className="text-red-600 mt-1 text-xl" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Vol</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                              {day.flight}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 px-6 py-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Coût journalier</span>
                      <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-lg">
                        <FaEuroSign /> {day.cost}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 flex-wrap">
                {/* Save Button - Conditional based on context */}
                {!isSavedProgram ? (
                  programSupabaseIds[index] ? (
                    // Already saved
                    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-green-500/30 flex items-center gap-2">
                      <FaCheck className="text-lg" />
                      Programme sauvegardé ✅
                    </div>
                  ) : (
                    // Not yet saved
                    <button
                      onClick={() => handleSaveProgram(index)}
                      disabled={saveLoading}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
                    >
                      <FaSave className="text-lg" />
                      {saveLoading
                        ? 'Enregistrement en cours...'
                        : `Sauvegarder ce programme`
                      }
                    </button>
                  )
                ) : (
                  // Saved program from URL
                  <div className="bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-green-500/30 flex items-center gap-2">
                    <FaCheck className="text-lg" />
                    Programme sauvegardé ✅
                  </div>
                )}

                {/* Generate Another Button - Only show for last program if less than 2 AND not from TourCard (saved program) */}
                {index === programs.length - 1 && programs.length < 2 && !isSavedProgram && (
                  <button
                    onClick={handleGenerateAnother}
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
                  >
                    <FaMagic className="text-lg" />
                    Générer un autre programme
                  </button>
                )}

                {/* Compare Button - Only show when we have 2 or more programs */}
                {programs.length >= 2 && index === programs.length - 1 && (
                  <button
                    onClick={handleComparePrograms}
                    disabled={compareLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
                  >
                    <FaChartBar className="text-lg" />
                    {compareLoading ? 'Comparaison en cours...' : 'Comparer les programmes'}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Aucun itinéraire trouvé.
              </p>
            </div>
          )}
        </section>
      ))}

      {/* Save Success Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white dark:bg-[#19222b] p-8 rounded-3xl shadow-2xl max-w-md w-full relative animate-bounce-in border-2 border-purple-500">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white text-3xl transition-colors duration-200"
            >
              ✕
            </button>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="text-white text-5xl">✓</div>
              </div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                Programme sauvegardé !
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                Votre programme a été enregistré avec succès. Vous pouvez le retrouver dans votre espace personnel.
              </p>
              <button
                onClick={handleCloseModal}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-10 py-4 rounded-full shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Parfait !
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}