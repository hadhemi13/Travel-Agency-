'use client'

import { useState, useRef, useEffect } from 'react'
import {
  BsArrowRight,
  BsCalendar,
  BsDashCircle,
  BsPeople,
  BsPlusCircle,
  BsSearch,
} from 'react-icons/bs'
import { FaHotel } from 'react-icons/fa'
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/themes/dark.css'

type AvailabilityFormType = {
  guests: {
    adults: number
    children: number
    rooms: number
  }
}

const Hotel = () => {
  const initialValue: AvailabilityFormType = {
    guests: {
      adults: 2,
      rooms: 1,
      children: 0,
    },
  }

  const [formValue, setFormValue] = useState<AvailabilityFormType>(initialValue)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState('Search hotel')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const updateGuests = (
    type: keyof AvailabilityFormType['guests'],
    increase: boolean = true
  ) => {
    const val = formValue.guests[type]
    setFormValue({
      ...formValue,
      guests: {
        ...formValue.guests,
        [type]: increase ? val + 1 : val > 1 ? val - 1 : 0,
      },
    })
  }

  const getGuestsValue = (): string => {
    let value = ''
    const guests = formValue.guests
    if (guests.adults) {
      value += guests.adults + (guests.adults > 1 ? ' Adults ' : ' Adult ')
    }
    if (guests.children) {
      value += guests.children + (guests.children > 1 ? ' Children ' : ' Child ')
    }
    if (guests.rooms) {
      value += guests.rooms + (guests.rooms > 1 ? ' Rooms ' : ' Room ')
    }
    return value
  }

  const hotels = [
    'Search hotel',
    'San Jacinto, USA',
    'North Dakota, Canada',
    'West Virginia, Paris',
  ]

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-2xl p-0 w-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50">
        <h5 className="mb-0 flex items-center text-xl font-bold text-white">
          <FaHotel size={24} className="mr-3" />
          Hotel Booking
        </h5>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Hotel Search Dropdown */}
          <div className="lg:col-span-12">
            <div className="relative">
              <select
                value={selectedHotel}
                onChange={(e) => setSelectedHotel(e.target.value)}
                className="w-full h-14 pl-12 pr-4 text-base text-gray-300 bg-gray-800/60 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none backdrop-blur-sm"
              >
                {hotels.map((hotel, idx) => (
                  <option key={idx} value={hotel} className="bg-gray-800">
                    {hotel}
                  </option>
                ))}
              </select>
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <BsSearch size={20} />
              </span>
            </div>
          </div>

          {/* Guests Selector */}
          <div className="lg:col-span-4">
            <div className="relative" ref={dropdownRef}>
              <input
                type="text"
                readOnly
                className="w-full h-14 pl-12 pr-4 text-base text-gray-300 bg-gray-800/60 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer backdrop-blur-sm"
                placeholder="Select occupant"
                value={getGuestsValue()}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <BsPeople size={20} />
              </span>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute z-50 mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                  {/* Adults */}
                  <div className="flex justify-between items-center p-4 hover:bg-gray-750">
                    <div>
                      <h6 className="mb-0 font-semibold text-sm text-white">Adults</h6>
                      <small className="text-gray-400 text-xs">Ages 13 or above</small>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-purple-400 p-0 transition-colors"
                        onClick={() => updateGuests('adults', false)}
                      >
                        <BsDashCircle className="text-xl" />
                      </button>
                      <h6 className="mb-0 font-semibold min-w-[24px] text-center text-white">
                        {formValue.guests.adults ?? 0}
                      </h6>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-purple-400 p-0 transition-colors"
                        onClick={() => updateGuests('adults')}
                      >
                        <BsPlusCircle className="text-xl" />
                      </button>
                    </div>
                  </div>

                  <hr className="my-0 border-gray-700" />

                  {/* Children */}
                  <div className="flex justify-between items-center p-4 hover:bg-gray-750">
                    <div>
                      <h6 className="mb-0 font-semibold text-sm text-white">Child</h6>
                      <small className="text-gray-400 text-xs">Ages 13 below</small>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-purple-400 p-0 transition-colors"
                        onClick={() => updateGuests('children', false)}
                      >
                        <BsDashCircle className="text-xl" />
                      </button>
                      <h6 className="mb-0 font-semibold min-w-[24px] text-center text-white">
                        {formValue.guests.children ?? 0}
                      </h6>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-purple-400 p-0 transition-colors"
                        onClick={() => updateGuests('children')}
                      >
                        <BsPlusCircle className="text-xl" />
                      </button>
                    </div>
                  </div>

                  <hr className="my-0 border-gray-700" />

                  {/* Rooms */}
                  <div className="flex justify-between items-center p-4 hover:bg-gray-750">
                    <div>
                      <h6 className="mb-0 font-semibold text-sm text-white">Rooms</h6>
                      <small className="text-gray-400 text-xs">Max room 8</small>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-purple-400 p-0 transition-colors"
                        onClick={() => updateGuests('rooms', false)}
                      >
                        <BsDashCircle className="text-xl" />
                      </button>
                      <h6 className="mb-0 font-semibold min-w-[24px] text-center text-white">
                        {formValue.guests.rooms ?? 0}
                      </h6>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-purple-400 p-0 transition-colors"
                        onClick={() => updateGuests('rooms')}
                      >
                        <BsPlusCircle className="text-xl" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Check-in Date */}
          <div className="lg:col-span-4">
            <div className="relative">
              <Flatpickr
                className="w-full h-14 pl-12 pr-4 text-base text-gray-300 bg-gray-800/60 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer backdrop-blur-sm"
                options={{ dateFormat: 'd M y' }}
                placeholder="Select check-in date"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <BsCalendar size={20} />
              </span>
            </div>
          </div>

          {/* Check-out Date */}
          <div className="lg:col-span-4">
            <div className="relative">
              <Flatpickr
                className="w-full h-14 pl-12 pr-4 text-base text-gray-300 bg-gray-800/60 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer backdrop-blur-sm"
                options={{ dateFormat: 'd M y' }}
                placeholder="Select check-out date"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <BsCalendar size={20} />
              </span>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="text-center pt-6">
          <button
            type="button"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-base px-10 py-4 rounded-xl transition-all duration-200 flex items-center mx-auto shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
          >
            <span className="flex items-center">
              Search Hotel <BsArrowRight className="ml-3" size={20} />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Hotel