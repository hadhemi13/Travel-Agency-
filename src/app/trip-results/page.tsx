'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  FaPlane,
  FaCalendarAlt,
  FaEuroSign,
  FaSun,
  FaCloudSun,
  FaMoon,
  FaMapMarkedAlt,
} from 'react-icons/fa';
import TopNavBar from '@/components/TopNav/TopNavBar';

interface TripProgram {
  day: number;
  morning?: string;
  afternoon?: string;
  evening?: string;
  places?: string;
  flight?: string;
  cost: number;
}

export default function TripResults() {
  const searchParams = useSearchParams();
  const [programs, setPrograms] = useState<TripProgram[][]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedProgram, setSavedProgram] = useState<number | null>(null); // 1 ou 2

  const destination = searchParams.get('destination') || '';
  const type = searchParams.get('typeVoyage') || 'Aventure';
  const startDate = searchParams.get('dateDebut') || '';
  const endDate = searchParams.get('dateFin') || '';
  const budget = Number(searchParams.get('budget') || 0);

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

  // Automatically fetch first program on page load
  useEffect(() => {
    if (destination && programs.length === 0) fetchItinerary();
  }, [destination, type, startDate, endDate, budget]);

  const fetchItinerary = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, type, startDate, endDate, budget }),
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
        })
      );

      setPrograms((prev) => [...prev, formatted]);
    } catch (err) {
      console.error('Erreur récupération itinéraire:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnother = () => fetchItinerary();
  const handleComparePrograms = () => alert('Comparaison des deux programmes...');
  const handleSaveProgram = (num: number) => {
    setSavedProgram(num);
    setShowSaveModal(true);
  };
  const handleCloseModal = () => setShowSaveModal(false);

  return (
    <div className={`${darkMode ? 'bg-black text-gray-100' : 'bg-gray-50 text-gray-900'} min-h-screen transition-colors duration-500`}>
      <TopNavBar />

      {/* Hero */}
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
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow">
                {type}
              </span>
            </div>
            <div className="inline-block bg-gradient-to-r from-purple-700 to-blue-700 text-white font-bold px-6 py-3 rounded-full shadow-lg text-lg">
              Budget total : €{budget}
            </div>
          </div>
        </div>
      </section>

      {loading && <p className="text-center mt-10 text-lg">Chargement...</p>}

      {/* Programs */}
      {programs.map((program, index) => (
        <section
          key={index}
          className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {program.length > 0 ? (
            <>
              {program.map((day) => (
                <div
                  key={day.day}
                  className="bg-white dark:bg-[#19222b] rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-2xl"
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
                      <FaSun className="text-yellow-500 mt-1" />
                      <div>
                        <p className="font-semibold text-black dark:text-white">Matin :</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {day.morning || 'Aucune activité prévue'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaCloudSun className="text-orange-500 mt-1" />
                      <div>
                        <p className="font-semibold text-black dark:text-white">Après-midi :</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {day.afternoon || 'Aucune activité prévue'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FaMoon className="text-indigo-500 mt-1" />
                      <div>
                        <p className="font-semibold text-black dark:text-white">Soir :</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {day.evening || 'Aucune activité prévue'}
                        </p>
                      </div>
                    </div>
                    {day.places && (
                      <div className="flex items-start gap-3">
                        <FaMapMarkedAlt className="text-green-600 mt-1" />
                        <div>
                          <p className="font-semibold text-black dark:text-white">Lieux :</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{day.places}</p>
                        </div>
                      </div>
                    )}
                    {day.flight && (
                      <div className="flex items-start gap-3">
                        <FaPlane className="text-red-600 mt-1" />
                        <div>
                          <p className="font-semibold text-black dark:text-white">Vol :</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{day.flight}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-100 dark:bg-[#1f2a34] px-6 py-3 flex justify-between items-center text-sm font-semibold text-gray-800 dark:text-gray-100">
                    <span>Coût total</span>
                    <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                      <FaEuroSign /> {day.cost}
                    </div>
                  </div>
                </div>
              ))}

              {/* Buttons juste après ce programme */}
              <div className="flex justify-center mt-4 gap-4 col-span-full flex-wrap">
                {index === 0 && (
                  <>
                    <button
                      onClick={() => handleSaveProgram(1)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition"
                    >
                      Enregistrer le programme 1
                    </button>
                    <button
                      onClick={handleGenerateAnother}
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition"
                    >
                      Générer un autre programme
                    </button>
                  </>
                )}
                {index === 1 && (
                  <>
                    <button
                      onClick={handleComparePrograms}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition"
                    >
                      Comparer les 2 programmes
                    </button>
                    <button
                      onClick={() => handleSaveProgram(2)}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg transition"
                    >
                      Enregistrer le programme 2
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <p className="col-span-full text-center text-gray-600 dark:text-gray-300">
              Aucun itinéraire trouvé.
            </p>
          )}
        </section>
      ))}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-[#19222b] p-6 rounded-2xl shadow-2xl max-w-lg w-full relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">
              Programme {savedProgram} enregistré !
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Votre programme {savedProgram} a été sauvegardé avec succès.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
