'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BsArrowRight, BsCalendar, BsGeoAlt } from 'react-icons/bs'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/dark.css'
import TopNavBar from '@/components/TopNav/TopNavBar'
import Footer from '@/components/Footer'

const TravelSimulator = () => {
  const router = useRouter()
  const [budget, setBudget] = useState(100)
  const [voyageurs, setVoyageurs] = useState(1)
  const [destination, setDestination] = useState('Paris, France')
  const [typeVoyage, setTypeVoyage] = useState('Aventure')
  const [dateDebut, setDateDebut] = useState<Date | undefined>(undefined)
  const [dateFin, setDateFin] = useState<Date | undefined>(undefined)
  const [darkMode, setDarkMode] = useState(false)

  // Nouvelles caractéristiques
  const [dureeActivites, setDureeActivites] = useState('')
  const [preferenceRepas, setPreferenceRepas] = useState('')
  const [rythmeSejour, setRythmeSejour] = useState('')

  const destinations = ['Paris, France', 'Tokyo, Japon', 'New York, USA', 'Londres, UK', 'Dubaï, EAU']
  const typesVoyage = ['Aventure', 'Plage', 'Désert', 'Histoire', 'Culture', 'Relaxation']

  const optionsDuree = ['Courtes excursions ⏱️', 'Demi-journée 🌄', 'Journée complète 🗓️']
  const optionsRepas = ['Gastronomie locale 🍲', 'Street Food 🌮', 'Vegan / Végétarien 🥗', 'Fine Dining 🍷', 'Buffet hôtel 🍛']
  const optionsRythme = ['Détente 💤', 'Équilibré ⚖️', 'Intense 🚀']

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  const handleSimuler = () => {
    const query = new URLSearchParams({
      destination,
      typeVoyage,
      dateDebut: dateDebut ? dateDebut.toISOString().split('T')[0] : '',
      dateFin: dateFin ? dateFin.toISOString().split('T')[0] : '',
      budget: budget.toString(),
      voyageurs: voyageurs.toString(),
      dureeActivites,
      preferenceRepas,
      rythmeSejour
    }).toString()

    router.push(`/trip-results?${query}`)
  }

  const inputClass = `w-full h-14 px-4 text-base ${
    darkMode ? 'text-white placeholder-gray-300 bg-gray-700 border-gray-600' : 'text-gray-900 placeholder-gray-700 bg-white border-gray-300'
  } rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm`

  const boutonClass = (selection: string, valeur: string) =>
    `px-4 py-2 rounded-full border transition-all duration-200 m-1 ${
      selection === valeur
        ? 'bg-purple-600 text-white border-purple-600'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
    }`

  return (
    <div className={`${darkMode ? 'bg-black text-white' : 'bg-white text-gray-900'} min-h-screen`}>
      <TopNavBar />

      {/* Section Hero */}
      <section className="pt-6 relative">
        <div className="w-full bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: `url('/assets/images/bg/08.jpg')` }}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex justify-center">
              <div className="w-full md:w-2/3 lg:w-1/2 text-center py-24 md:py-32">
                <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  Planifiez Votre Voyage Parfait
                </h1>
                <p className="text-white/90 text-lg md:text-xl mb-0">
                  Simulez et budgétez votre expérience de voyage de rêve dans le monde entier
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Formulaire */}
        <div className="container mx-auto px-4 -mt-20 pb-16 relative z-20">
          <div className="flex justify-center">
            <div className="w-full lg:w-3/4 xl:w-2/3">
              <div className={`${darkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-sm rounded-2xl shadow-2xl p-6 w-full`}>
                <div className="grid grid-cols-1 gap-4">

                  {/* Budget & Voyageurs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Budget (€)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={budget}
                        onChange={(e) => setBudget(parseFloat(e.target.value) || 0)}
                        className={inputClass}
                        placeholder="Entrez budget"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Nombre de voyageurs</label>
                      <input
                        type="number"
                        min={1}
                        value={voyageurs}
                        onChange={(e) => setVoyageurs(parseInt(e.target.value) || 1)}
                        className={inputClass}
                        placeholder="Nombre de voyageurs"
                      />
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="relative">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Destination</label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className={inputClass + ' pl-12'}
                    >
                      {destinations.map((loc, idx) => (
                        <option key={idx} value={loc}>{loc}</option>
                      ))}
                    </select>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><BsGeoAlt size={20} /></span>
                  </div>

                  {/* Dates & Type de voyage */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="relative">
                      <Flatpickr
                        value={dateDebut || undefined}
                        onChange={(dates) => setDateDebut(dates[0] || undefined)}
                        className={inputClass + ' pl-12 cursor-pointer'}
                        options={{ dateFormat: 'd M y' }}
                        placeholder="Date de début"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><BsCalendar size={20} /></span>
                    </div>

                    <div className="relative">
                      <Flatpickr
                        value={dateFin || undefined}
                        onChange={(dates) => setDateFin(dates[0] || undefined)}
                        className={inputClass + ' pl-12 cursor-pointer'}
                        options={{ dateFormat: 'd M y' }}
                        placeholder="Date de fin"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><BsCalendar size={20} /></span>
                    </div>

                    <div className="relative">
                      <select
                        value={typeVoyage}
                        onChange={(e) => setTypeVoyage(e.target.value)}
                        className={inputClass + ' pl-4'}
                      >
                        {typesVoyage.map((type, idx) => (
                          <option key={idx} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Caractéristiques supplémentaires */}
                  <div>
                    <label className="block font-semibold mb-2">🕒 Durée des activités / planning journalier</label>
                    <div className="flex flex-wrap">
                      {optionsDuree.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={boutonClass(dureeActivites, opt)}
                          onClick={() => setDureeActivites(opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">🍴 Préférences culinaires / restauration</label>
                    <div className="flex flex-wrap">
                      {optionsRepas.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={boutonClass(preferenceRepas, opt)}
                          onClick={() => setPreferenceRepas(opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">⚖️ Rythme du séjour</label>
                    <div className="flex flex-wrap">
                      {optionsRythme.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          className={boutonClass(rythmeSejour, opt)}
                          onClick={() => setRythmeSejour(opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bouton Simuler */}
                  <div className="text-center pt-6">
                    <button
                      type="button"
                      onClick={handleSimuler}
                      className="bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white font-semibold text-lg px-8 py-3 rounded-xl transition-all duration-200 flex items-center mx-auto shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                    >
                      Simuler <BsArrowRight className="ml-3" size={20} />
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default TravelSimulator
