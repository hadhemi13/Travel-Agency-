'use client'
import Image from 'next/image'
import Link from 'next/link'
import { FaCalendarAlt } from 'react-icons/fa'
import { FaHotel, FaPersonSkating, FaPlane } from 'react-icons/fa6'
import { TourHistoryType } from '../../data'

const TourCard = ({ tour }: { tour: TourHistoryType }) => {
    const { benefits, travelDate, bookingDate, days, name, nights, price, type, status, image, bookingReference } = tour

    const statusColors = {
        completed: 'bg-green-600',
        upcoming: 'bg-blue-600',
        cancelled: 'bg-red-600'
    }

    const statusLabels = {
        completed: 'Completed',
        upcoming: 'Upcoming',
        cancelled: 'Cancelled'
    }

    return (
        <div className="group bg-white dark:bg-[#222529] rounded-xl shadow-md hover:shadow-2xl dark:shadow-[0_0.5rem_1rem_rgba(0,0,0,0.5)] transition-all duration-300 pb-0 h-full flex flex-col hover:-translate-y-1">
            {/* Image with Overlay */}
            <div className="relative overflow-hidden rounded-t-xl">
                <Image
                    src={image}
                    alt={name}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover rounded-t-xl group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 flex flex-col p-4 z-10">
                    <div className="flex gap-2">
                        <span className={`${statusColors[status]} text-white px-3 py-1 rounded text-sm font-medium`}>
                            {statusLabels[status]}
                        </span>
                        <span className="bg-gray-900 text-white px-3 py-1 rounded text-sm font-medium">
                            {type}
                        </span>
                    </div>
                    <div className="w-full mt-auto">
                        <span className="inline-block bg-white text-gray-900 px-3 py-1.5 rounded-lg text-sm font-semibold shadow-lg" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            {days} days / {nights} nights
                        </span>
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="px-4 py-4 flex-1 flex flex-col">
                <h5 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#8e85e6] transition-colors duration-300">
                    <Link href={`/historique/${tour.id}`} className="stretched-link">
                        {name}
                    </Link>
                </h5>

                <div className="space-y-1 mb-3">
                    <span className="flex items-center text-sm text-gray-600 dark:text-[#b0b0b8]">
                        <FaCalendarAlt className="mr-2 opacity-70" />
                        Travel: {travelDate}
                    </span>


                </div>

                {/* Benefits List */}
                <ul className="flex flex-wrap gap-4 mt-3 mb-0">
                    {benefits.flight && (
                        <li className="flex items-center text-base font-normal mb-0 group/item text-gray-700 dark:text-[#b0b0b8]">
                            <FaPlane className="text-orange-500 mr-2 group-hover/item:scale-110 transition-transform duration-300" />
                            <span className="group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{benefits.flight} Flight</span>
                        </li>
                    )}
                    {benefits.hotel && (
                        <li className="flex items-center text-base font-normal mb-0 group/item text-gray-700 dark:text-[#b0b0b8]">
                            <FaHotel className="text-sky-400 mr-2 group-hover/item:scale-110 transition-transform duration-300" />
                            <span className="group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{benefits.hotel} Hotel</span>
                        </li>
                    )}
                    {benefits.activities && (
                        <li className="flex items-center text-base font-normal mb-0 group/item text-gray-700 dark:text-[#b0b0b8]">
                            <FaPersonSkating className="text-red-500 mr-2 group-hover/item:scale-110 transition-transform duration-300" />
                            <span className="group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">{benefits.activities} Activities</span>
                        </li>
                    )}
                </ul>
            </div>

            {/* Card Footer */}
            <div className="px-4 pb-4 pt-0 mt-auto">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h5 className="text-2xl font-normal text-green-600 dark:text-[#0cbc87] mb-0">
                            ${price}
                        </h5>
                        <small className="text-gray-600 dark:text-[#a1a1a8]">/total</small>
                    </div>
                    <div className="flex gap-2 relative z-10">
                        <Link
                            href={`/historique/${tour.id}`}
                            className="px-4 py-2 bg-purple-600 dark:bg-[#8e85e6] hover:bg-purple-700 dark:hover:bg-[#7a6deb] hover:shadow-lg text-white text-sm font-medium rounded-sm transition-all duration-300 hover:scale-105"
                        >
                            View Details
                        </Link>
                        {status === 'upcoming' && (
                            <button className="px-4 py-2 bg-red-600 dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 hover:shadow-lg text-white text-sm font-medium rounded transition-all duration-300 hover:scale-105">
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TourCard

