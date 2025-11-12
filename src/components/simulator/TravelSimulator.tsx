'use client'

import { useState, useRef, useEffect } from 'react'
import {
  BsArrowRight,
  BsCalendar,
  BsDashCircle,
  BsGeoAlt,
  BsPlusCircle,
} from 'react-icons/bs'
import { FaGlobeAmericas } from 'react-icons/fa'
import { FaPersonSkating } from 'react-icons/fa6'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/dark.css'

const TravelSimulator = () => {
  const [budgetAccommodation, setBudgetAccommodation] = useState(100)
  const [budgetActivities, setBudgetActivities] = useState(50)
  const [selectedLocation, setSelectedLocation] = useState('Search location')
  const [selectedTripType, setSelectedTripType] = useState('Select trip type')

  const locations = [
    'Search location',
    'Paris, France',
    'Tokyo, Japan',
    'New York, USA',
    'London, UK',
    'Dubai, UAE',
  ]

  const tripTypes = [
    'Select trip type',
    'Adventure',
    'Beach',
    'Desert',
    'History',
    'Cultural',
    'Relaxation',
  ]

  const updateBudget = (
    type: 'accommodation' | 'activities',
    increase: boolean = true
  ) => {
    if (type === 'accommodation') {
      setBudgetAccommodation(prev => increase ? prev + 0.5 : Math.max(0, prev - 0.5))
    } else {
      setBudgetActivities(prev => increase ? prev + 0.5 : Math.max(0, prev - 0.5))
    }
  }

  return (
    <section className="pt-0 bg-gray-950">
      {/* Hero Section */}
      <div
        className="w-full bg-cover bg-center bg-no-repeat relative"
        style={{
          backgroundImage: `url('/assets/images/bg/08.jpg')`,
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex justify-center">
            <div className="w-full md:w-2/3 lg:w-1/2 text-center py-24 md:py-32">
              <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Plan Your Perfect Journey
              </h1>
              <p className="text-white/90 text-lg md:text-xl mb-0">
                Simulate and budget your dream travel experience worldwide
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 -mt-20 pb-16 relative z-20">
        <div className="flex justify-center">
          <div className="w-full lg:w-3/4 xl:w-2/3">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-0 w-full">
              {/* Header */}
              <div className="p-6 border-b border-gray-700/50">
                <h5 className="mb-0 flex items-center text-xl font-bold text-white">
                  <FaGlobeAmericas size={24} className="mr-3" />
                  Travel Simulator
                </h5>
              </div>

              {/* Body */}
              <div className="p-4 pt-0">
                <div className="grid grid-cols-1 gap-4">
                  {/* Budget Inputs Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Budget Accommodation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Budget Accommodation ($)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.5"
                          value={budgetAccommodation}
                          onChange={(e) => setBudgetAccommodation(parseFloat(e.target.value) || 0)}
                          className="flex-1 h-14 px-4 text-base text-gray-300 bg-gray-800/60 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="Enter budget"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-purple-400 p-2 transition-colors bg-gray-800/60 border border-gray-700/50 rounded-lg"
                            onClick={() => updateBudget('accommodation', false)}
                          >
                            <BsDashCircle size={20} />
                          </button>
                          <button
                            type="button"
                            className="text-gray-400 hover:text-purple-400 p-2 transition-colors bg-gray-800/60 border border-gray-700/50 rounded-lg"
                            onClick={() => updateBudget('accommodation', true)}
                          >
                            <BsPlusCircle size={20} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Budget Activities */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Budget Activities ($)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.5"
                          value={budgetActivities}
                          onChange={(e) => setBudgetActivities(parseFloat(e.target.value) || 0)}
                          className="flex-1 h-14 px-4 text-base text-gray-300 bg-gray-800/60 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          placeholder="Enter budget"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="text-gray-400 hover:text-purple-400 p-2 transition-colors bg-gray-800/60 border border-gray-700/50 rounded-lg"
                            onClick={() => updateBudget('activities', false)}
                          >
                            <BsDashCircle size={20} />
                          </button>
                          <button
                            type="button"
                            className="text-gray-400 hover:text-purple-400 p-2 transition-colors bg-gray-800/60 border border-gray-700/50 rounded-lg"
                            onClick={() => updateBudget('activities', true)}
                          >
                            <BsPlusCircle size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location Search */}
                  <div className="relative">
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full h-14 pl-12 pr-4 text-base text-gray-300 bg-gray-800/60 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none backdrop-blur-sm"
                    >
                      {locations.map((location, idx) => (
                        <option key={idx} value={location} className="bg-gray-800">
                          {location}
                        </option>
                      ))}
                    </select>
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <BsGeoAlt size={20} />
                    </span>
                  </div>

                  {/* Dates and Trip Type Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Start Date */}
                    <div className="relative">
                      <Flatpickr
                        className="w-full h-14 pl-12 pr-4 text-base text-gray-300 bg-gray-800/60 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer backdrop-blur-sm"
                        options={{ dateFormat: 'd M y' }}
                        placeholder="Select trip start date"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <BsCalendar size={20} />
                      </span>
                    </div>

                    {/* End Date */}
                    <div className="relative">
                      <Flatpickr
                        className="w-full h-14 pl-12 pr-4 text-base text-gray-300 bg-gray-800/60 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer backdrop-blur-sm"
                        options={{ dateFormat: 'd M y' }}
                        placeholder="Select trip end date"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <BsCalendar size={20} />
                      </span>
                    </div>

                    {/* Trip Type */}
                    <div className="relative">
                      <select
                        value={selectedTripType}
                        onChange={(e) => setSelectedTripType(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 text-base text-gray-300 bg-gray-800/60 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none backdrop-blur-sm"
                      >
                        {tripTypes.map((type, idx) => (
                          <option key={idx} value={type} className="bg-gray-800">
                            {type}
                          </option>
                        ))}
                      </select>
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <FaPersonSkating size={20} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simulate Button */}
                <div className="text-center pt-6">
                  <button
                    type="button"
                    className="bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-800 hover:to-blue-800 text-white font-semibold text-lg px-8 py-3 rounded-xl transition-all duration-200 flex items-center mx-auto shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 -mb-7"
                  >
                    <span className="flex items-center">
                      Simulate <BsArrowRight className="ml-3" size={20} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TravelSimulator