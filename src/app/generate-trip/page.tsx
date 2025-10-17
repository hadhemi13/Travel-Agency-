'use client';

import { useState, FormEvent, useEffect } from 'react';
import {
  FaCalendar,
  FaHotel,
  FaPersonSkating,
  FaPlane,
  FaMoon,
  FaSun,
} from 'react-icons/fa6';
import TopNav from '@/components/TopNav/TopNavBar';
import bgImg10 from '@/assets/images/bg/10.jpg';
import { useRouter } from 'next/navigation';

interface TripProgram {
  day: number;
  activity: string;
  hotel: string;
  flight?: string;
  cost: number;
}

export default function CreateTrip() {
  const [form, setForm] = useState({
    destination: '',
    type: 'aventure',
    budget: 0,
    duration: 2,
    startDate: '',
    endDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [program, setProgram] = useState<TripProgram[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Persist theme preference in localStorage
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const query = new URLSearchParams({
      destination: form.destination,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      budget: String(form.budget),
      duration: String(form.duration),
    }).toString();

    router.push(`/trip-results?${query}`);
  };

  const types = ['aventure', 'relax', 'culturel', 'famille', 'luxe'];

  return (
    <div
      className={`relative w-full h-full transition-colors duration-500 ${
        darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-black'
      }`}
    >
      {/* Hero / Top section */}
      <section
        className="relative w-full h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImg10.src})` }}
      >
        <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center">
          <TopNav />

          {/* Dark mode toggle button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Dark Mode"
            className="absolute top-6 right-8 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md transition"
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>

          <div className="max-w-3xl w-full">
            <h1 className="text-[#5143D9] dark:text-[#aabbff] text-5xl md:text-6xl font-extrabold mb-8 drop-shadow-md">
              Planifiez Votre Voyage de Rêve
            </h1>

            <form
              onSubmit={handleSubmit}
              className="text-lg md:text-xl font-semibold space-y-8"
            >
              <div className="flex flex-wrap justify-center items-center gap-4 text-black dark:text-gray-200">
                <span>Nous sommes</span>

                <input
                  type="number"
                  min={1}
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: Number(e.target.value) })
                  }
                  className="w-20 bg-transparent border-b-2 border-dotted border-black dark:border-gray-300 text-black dark:text-gray-200 text-center placeholder-black dark:placeholder-gray-400 px-2 py-1 focus:outline-none focus:ring-0 focus:border-black dark:focus:border-gray-300 transition"
                />

                <span>personnes, avec un budget de</span>

                <input
                  type="number"
                  min={0}
                  value={form.budget}
                  onChange={(e) =>
                    setForm({ ...form, budget: Number(e.target.value) })
                  }
                  placeholder="€"
                  className="w-28 bg-transparent border-b-2 border-dotted border-black dark:border-gray-300 text-black dark:text-gray-200 text-center placeholder-black dark:placeholder-gray-400 px-2 py-1 focus:outline-none focus:ring-0 focus:border-black dark:focus:border-gray-300 transition"
                />

                <span>€, cherchant un voyage</span>

                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="bg-transparent border-b-2 border-dotted border-black dark:border-gray-300 text-black dark:text-gray-200 px-2 py-1 focus:outline-none focus:ring-0 focus:border-black dark:focus:border-gray-300 transition w-36 text-center font-semibold"
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>

                <span>autour de</span>

                <input
                  placeholder="Destination"
                  value={form.destination}
                  onChange={(e) =>
                    setForm({ ...form, destination: e.target.value })
                  }
                  className="w-48 bg-transparent border-b-2 border-dotted border-black dark:border-gray-300 text-black dark:text-gray-200 placeholder-black dark:placeholder-gray-400 text-center px-2 py-1 focus:outline-none focus:ring-0 focus:border-black dark:focus:border-gray-300 transition"
                />

                <span>, du</span>

                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm({ ...form, startDate: e.target.value })
                  }
                  className="bg-transparent border-b-2 border-dotted border-black dark:border-gray-300 text-black dark:text-gray-200 px-2 py-1 rounded-sm focus:outline-none focus:ring-0 focus:border-black dark:focus:border-gray-300 transition"
                />

                <span>au</span>

                <input
                  type="date"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm({ ...form, endDate: e.target.value })
                  }
                  className="bg-transparent border-b-2 border-dotted border-black dark:border-gray-300 text-black dark:text-gray-200 px-2 py-1 rounded-sm focus:outline-none focus:ring-0 focus:border-black dark:focus:border-gray-300 transition"
                />

                <span>.</span>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  aria-label="Rechercher"
                  className="w-28 h-28 rounded-full font-semibold text-xl shadow-[0_8px_15px_rgba(81,67,217,0.8)] bg-[#5143D9] text-white transition-transform hover:scale-110 flex items-center justify-center"
                >
                  {loading ? 'Chargement...' : 'Rechercher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Program Cards Section */}
      <section className="relative z-10 bg-white dark:bg-gray-800 py-16 px-4 transition-colors duration-500">
        <div className="max-w-6xl mx-auto">
          {program.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {program.map((day) => (
                <div
                  key={day.day}
                  className="bg-white dark:bg-gray-700 rounded-2xl shadow-xl p-6 hover:scale-105 transition-transform"
                >
                  <h3 className="font-bold text-xl text-indigo-600 dark:text-indigo-300 text-center mb-3">
                    Jour {day.day}
                  </h3>
                  <p className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <FaPersonSkating className="text-blue-500" /> {day.activity}
                  </p>
                  {day.hotel && (
                    <p className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <FaHotel className="text-green-500" /> {day.hotel}
                    </p>
                  )}
                  {day.flight && (
                    <p className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                      <FaPlane className="text-red-500" /> {day.flight}
                    </p>
                  )}
                  <p className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-semibold mt-4">
                    <FaCalendar className="text-yellow-500" /> Coût : €{day.cost}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
