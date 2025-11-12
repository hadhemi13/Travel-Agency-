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
  FaRoute,
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
  transport?: string;
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
  const [programCities, setProgramCities] = useState<string[][]>([]); // ← NEW: Track cities per program
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

  const destination = searchParams.get('destination') || '';
  const type = searchParams.get('typeVoyage') || 'Aventure';
  const startDate = searchParams.get('dateDebut') || '';
  const endDate = searchParams.get('dateFin') || '';
  const budget = Number(searchParams.get('budget') || 0);
  const voyageurs = Number(searchParams.get('voyageurs') || 1);
  const dureeActivites = searchParams.get('dureeActivites') || '';
  const preferenceRepas = searchParams.get('preferenceRepas') || '';
  const rythmeSejour = searchParams.get('rythmeSejour') || '';

  const hasFetched = useRef(false);

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

  // Fetch first program on load
  useEffect(() => {
    if (!hasFetched.current && destination) {
      hasFetched.current = true;
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
      const res = await fetch(`/api/saved-programmes/${programmeId}`);
      const data = await res.json();

      if (res.ok && data.programme) {
        const savedProgram = data.programme;
        const formatted: TripProgram[] = (Array.isArray(savedProgram.programme) ? savedProgram.programme : []).map(
          (item: any) => ({
            day: item.day,
            morning: item.matin || '',
            afternoon: item.apresmidi || '',
            evening: item.soir || '',
            places: item.lieu || '',
            flight: item.flight || '',
            transport: item.transport || '',
            cost: item.cout || 0,
            categorieActivites: item.categorieActivites || {},
            tempsEstime: item.tempsEstime || {},
            distanceKm: item.distanceKm || 0,
            hotel: item.hotel || null,
          })
        );

        setPrograms([formatted]);
        setProgramSupabaseIds([programmeId]);
        setProgramCities([[]]); // No city info from saved
      } else {
        fetchItinerary();
      }
    } catch (err) {
      fetchItinerary();
    } finally {
      setLoading(false);
    }
  };

  const fetchItinerary = async () => {
    setLoading(true);
    try {
      const previousProgram = programs[programs.length - 1] || null;

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
          previousProgram,
        }),
      });

      const data = await res.json();

      // === DESTRUCTURE plan + cities ===
      const { plan: rawPlan, cities } = data;

      console.log("Cities used:", cities); // Debug

      const formatted: TripProgram[] = (Array.isArray(rawPlan) ? rawPlan : []).map(
        (item: any) => ({
          day: item.day,
          morning: item.matin || '',
          afternoon: item.apresmidi || '',
          evening: item.soir || '',
          places: item.lieu || '',
          flight: item.flight || '',
          transport: item.transport || '',
          cost: item.cout || 0,
          categorieActivites: item.categorieActivites || {},
          tempsEstime: item.tempsEstime || {},
          distanceKm: item.distanceKm || 0,
          hotel: item.hotel || null,
        })
      );

      setPrograms((prev) => [...prev, formatted]);
      setProgramCities((prev) => [...prev, cities || []]); // ← SAVE CITIES
      setProgramSupabaseIds((prev) => [...prev, null]);
    } catch (err) {
      console.error('Error fetching itinerary:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnother = () => fetchItinerary();

  const handleSaveProgram = async (programIndex: number) => {
    setSaveLoading(true);
    setSaveError(null);

    try {
      const programToSave = programs[programIndex];
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
        hotel: day.hotel || null,
        transport: day.transport || '',
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

      if (!response.ok) throw new Error(data.error || 'Erreur lors de l\'enregistrement');

      setSavedProgram(programIndex + 1);
      setShowSaveModal(true);

      const newIds = [...programSupabaseIds];
      newIds[programIndex] = data.programId;
      setProgramSupabaseIds(newIds);
    } catch (error: any) {
      setSaveError(error.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSaveModal(false);
    setSaveError(null);
  };

  const handleComparePrograms = async () => {
    if (programs.length < 2) {
      setCompareError("Génère 2 programmes pour comparer");
      return;
    }

    setCompareLoading(true);
    setCompareError(null);

    try {
      const savedIds = [...programSupabaseIds];

      // Save program 1 if not saved
      if (!savedIds[0]) {
        const res1 = await fetch('/api/trips/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination, type, budget, startDate, endDate, voyageurs,
            programme: programs[0].map(d => ({ ...d, matin: d.morning, apresmidi: d.afternoon, soir: d.evening, lieu: d.places, repas: '', cout: d.cost, transport: d.transport }))
          }),
        });
        const data1 = await res1.json();
        if (!res1.ok) throw new Error(data1.error);
        savedIds[0] = data1.programId;
      }

      // Save program 2
      if (!savedIds[1]) {
        const res2 = await fetch('/api/trips/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            destination, type, budget, startDate, endDate, voyageurs,
            programme: programs[1].map(d => ({ ...d, matin: d.morning, apresmidi: d.afternoon, soir: d.evening, lieu: d.places, repas: '', cout: d.cost, transport: d.transport }))
          }),
        });
        const data2 = await res2.json();
        if (!res2.ok) throw new Error(data2.error);
        savedIds[1] = data2.programId;
      }

      setProgramSupabaseIds(savedIds);

      const result = await comparePrograms(
        { supabaseId: savedIds[0], destination, type, budget, startDate, endDate, voyageurs, programme: programs[0].map(d => ({ ...d, matin: d.morning, apresmidi: d.afternoon, soir: d.evening, lieu: d.places, repas: '', cout: d.cost, transport: d.transport })) },
        { supabaseId: savedIds[1], destination, type, budget, startDate, endDate, voyageurs, programme: programs[1].map(d => ({ ...d, matin: d.morning, apresmidi: d.afternoon, soir: d.evening, lieu: d.places, repas: '', cout: d.cost, transport: d.transport })) }
      );

      if (result.success) {
        router.push(`/travel-comparator/${result.comparisonId}`);
      } else {
        setCompareError(result.error);
      }
    } catch (error: any) {
      setCompareError(error.message);
    } finally {
      setCompareLoading(false);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'} min-h-screen transition-colors duration-500`}>
      <TopNavBar />

      {/* Hero */}
      <section className="relative w-full py-20 bg-cover bg-center" style={{ backgroundImage: `url('/assets/images/bg/08.jpg')` }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="container mx-auto px-4 relative z-10 flex justify-center">
          <div className="max-w-3xl w-full bg-white dark:bg-[#19222b] rounded-3xl p-8 backdrop-blur-md shadow-2xl text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{destination || 'Destination'}</h1>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {startDate && endDate && (
                <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow">
                  {startDate} → {endDate}
                </span>
              )}
              <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow">{type}</span>
            </div>
            <div className="inline-block bg-gradient-to-r from-purple-700 to-blue-700 text-white font-bold px-6 py-3 rounded-full shadow-lg text-lg">
              Budget total : €{budget}
            </div>
          </div>
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center mt-10">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
            <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">Génération magique en cours...</p>
          </div>
        </div>
      )}

      {/* Errors */}
      {saveError && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <div className="bg-red-100 dark:bg-red-900/30 border-2 border-red-400 text-red-700 dark:text-red-300 px-6 py-4 rounded-xl shadow-lg">
            <p className="font-bold text-lg mb-1">Error</p>
            <p>{saveError}</p>
          </div>
        </div>
      )}

      {compareError && (
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <div className="bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-400 text-orange-700 dark:text-orange-300 px-6 py-4 rounded-xl shadow-lg">
            <p className="font-bold text-lg mb-1">Comparaison Error</p>
            <p>{compareError}</p>
          </div>
        </div>
      )}

      {/* Programs */}
      {programs.map((program, index) => (
        <section key={index} className="max-w-6xl mx-auto py-12 px-4">
          {program.length > 0 ? (
            <>
              {/* Program Header with Cities */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                  Programme {index + 1}
                </h2>

                {/* ← DISPLAY CITIES */}
                {programCities[index] && programCities[index].length > 0 && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center justify-center gap-2">
                    <FaRoute className="text-purple-600" />
                    <strong>Itinéraire :</strong> {programCities[index].join(' → ')}
                  </p>
                )}

                <p className="text-gray-600 dark:text-gray-400">
                  Votre voyage personnalisé en {destination}
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
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Itinéraire</span>
                    </div>

                    <div className="p-6 space-y-5">
                      <div className="flex items-start gap-3">
                        <FaSun className="text-yellow-500 mt-1 text-xl" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Matin</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {day.morning || 'Repos'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FaCloudSun className="text-orange-500 mt-1 text-xl" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Après-midi</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {day.afternoon || 'Libre'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <FaMoon className="text-indigo-500 mt-1 text-xl" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Soir</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {day.evening || 'Dîner libre'}
                          </p>
                        </div>
                      </div>

                      {day.places && (
                        <div className="flex items-start gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <FaMapMarkedAlt className="text-green-600 mt-1 text-xl" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Lieu</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{day.places}</p>
                          </div>
                        </div>
                      )}

                      {day.transport && (
                        <div className="flex items-start gap-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                          <FaPlane className="text-red-600 mt-1 text-xl" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Transport</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{day.transport}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 px-6 py-4 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Coût</span>
                      <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-bold text-lg">
                        <FaEuroSign /> {day.cost}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center gap-4 flex-wrap">
                {!isSavedProgram ? (
                  programSupabaseIds[index] ? (
                    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg flex items-center gap-2">
                      <FaCheck /> Sauvegardé
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSaveProgram(index)}
                      disabled={saveLoading}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg flex items-center gap-2 transform hover:scale-105"
                    >
                      <FaSave /> {saveLoading ? 'En cours...' : 'Sauvegarder'}
                    </button>
                  )
                ) : (
                  <div className="bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg flex items-center gap-2">
                    <FaCheck /> Sauvegardé
                  </div>
                )}

                {index === programs.length - 1 && programs.length < 2 && (
                  <button
                    onClick={handleGenerateAnother}
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 disabled:from-gray-400 text-white font-semibold px-8 py-3 rounded-full shadow-lg flex items-center gap-2 transform hover:scale-105"
                  >
                    <FaMagic /> Générer un autre
                  </button>
                )}

                {programs.length >= 2 && index === programs.length - 1 && (
                  <button
                    onClick={handleComparePrograms}
                    disabled={compareLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 text-white font-semibold px-8 py-3 rounded-full shadow-lg flex items-center gap-2 transform hover:scale-105"
                  >
                    <FaChartBar /> {compareLoading ? 'Comparaison...' : 'Comparer'}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 dark:text-gray-300">Aucun itinéraire.</p>
            </div>
          )}
        </section>
      ))}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white dark:bg-[#19222b] p-8 rounded-3xl shadow-2xl max-w-md w-full relative animate-bounce-in border-2 border-purple-500">
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-3xl">×</button>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="text-white text-5xl">✓</div>
              </div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-700 to-blue-700 bg-clip-text text-transparent">
                Sauvegardé !
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                Votre programme est dans votre espace personnel.
              </p>
              <button
                onClick={handleCloseModal}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-10 py-4 rounded-full shadow-lg transform hover:scale-105"
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