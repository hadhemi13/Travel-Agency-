'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  FaCalendar,
  FaHotel,
  FaPersonSkating,
  FaPlane,
  FaMoon,
  FaSun,
} from 'react-icons/fa6';
import TopNav from '@/components/TopNav/TopNavBar';

interface TripProgram {
  day: number;
  activity: string;
  hotel: string;
  flight?: string;
  cost: number;
}

export default function TripResults() {
  const searchParams = useSearchParams();
  const [program, setProgram] = useState<TripProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const destination = searchParams.get('destination') || '';
  const type = searchParams.get('type') || 'aventure';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const budget = Number(searchParams.get('budget') || 0);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setDarkMode(true);
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

  useEffect(() => {
    const fetchItinerary = async () => {
      try {
        const res = await fetch('/api/trips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ destination, type, startDate, endDate, budget }),
        });
        const data = await res.json();
        setProgram(Array.isArray(data.plan) ? data.plan : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItinerary();
  }, [destination, type, startDate, endDate, budget]);

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-black'} min-h-screen transition-colors duration-500`}>
      {/* Top Navigation */}
      <TopNav />

      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        aria-label="Toggle Dark Mode"
        className="fixed top-6 right-6 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md z-50 transition"
      >
        {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
      </button>

      {/* Hero Section */}
      <section className="relative w-full py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center">
        <div className="max-w-4xl mx-auto bg-white/10 dark:bg-gray-800/30 backdrop-blur-md rounded-xl p-8 shadow-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Itinéraire pour {destination || 'votre voyage'}
          </h1>
          <p className="text-lg md:text-xl">
            {startDate && endDate ? `${startDate} → ${endDate}` : 'Dates non spécifiées'} • {type.charAt(0).toUpperCase() + type.slice(1)} • Budget: €{budget}
          </p>
        </div>
      </section>

      {/* Loading */}
      {loading && (
        <p className="text-center mt-8 text-lg">Chargement...</p>
      )}

      {/* Program Cards */}
      <section className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {program.map((day) => (
            <div
              key={day.day}
              className="bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl shadow-xl p-6 hover:scale-105 hover:shadow-2xl transition-transform duration-300"
            >
              <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300 text-center mb-4">
                Jour {day.day}
              </h2>
              <p className="flex items-center gap-3 mb-2 text-gray-700 dark:text-gray-200">
                <FaPersonSkating className="text-blue-500" size={20} /> {day.activity}
              </p>
              {day.hotel && (
                <p className="flex items-center gap-3 mb-2 text-gray-700 dark:text-gray-200">
                  <FaHotel className="text-green-500" size={20} /> {day.hotel}
                </p>
              )}
              {day.flight && (
                <p className="flex items-center gap-3 mb-2 text-gray-700 dark:text-gray-200">
                  <FaPlane className="text-red-500" size={20} /> {day.flight}
                </p>
              )}
              <p className="flex items-center gap-3 mt-4 font-semibold text-gray-700 dark:text-gray-200">
                <FaCalendar className="text-yellow-500" size={20} /> Coût : €{day.cost}
              </p>
            </div>
          ))}

          {program.length === 0 && !loading && (
            <p className="col-span-full text-center text-lg text-gray-600 dark:text-gray-300">
              Aucun itinéraire trouvé pour ces paramètres.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
