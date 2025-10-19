'use client'
import Image from 'next/image'
import Link from 'next/link'
import { FaMapMarkerAlt, FaPhone, FaArrowRight, FaHeart, FaCheck, FaClock } from 'react-icons/fa'
import { BsBuilding } from 'react-icons/bs'
import { TourHistoryType } from '../../data'

const TourCard = ({ tour }: { tour: TourHistoryType }) => {
    const { benefits, travelDate, bookingDate, days, name, nights, price, type, status, image, bookingReference } = tour


    return (
        <div className="bg-gray-800 dark:bg-[#2a2c31] rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
            {/* Image Section */}
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={image}
                    alt={name}
                    width={500}
                    height={300}
                    className="w-full h-full object-cover"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex space-x-2">
                    {/* Type Badge */}
                    <span className="flex items-center px-3 py-1 bg-black text-white text-sm font-semibold rounded-full">
                        <BsBuilding className="mr-1 text-yellow-400" /> {type}
                    </span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-grow text-white">
                {/* Title */}
                <h3 className="text-xl font-bold mb-2 leading-tight text-white">
                    {name}
                </h3>

                {/* Travel Date */}
                <p className="flex items-center text-gray-300 text-sm mb-1">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" /> {travelDate}
                </p>

                {/* Duration & Travelers */}
                <p className="flex items-center text-gray-300 text-sm mb-4">
                    <FaPhone className="mr-2 text-gray-400" /> {days} jours • {nights} nuits
                </p>

                {/* Action Row */}
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-600">
                    <Link href={`/trip-results?destination=${encodeURIComponent(tour.name)}&typeVoyage=${encodeURIComponent(tour.type)}&dateDebut=${encodeURIComponent(tour.travelDate.split(' → ')[0])}&dateFin=${encodeURIComponent(tour.travelDate.split(' → ')[1])}&budget=${tour.price}&voyageurs=1&programmeId=${tour.originalId || tour.programmeId || tour.id}`} className="flex items-center text-[#8e85e6] hover:text-[#7a6deb] transition-colors text-sm font-medium">
                        View detail <FaArrowRight className="ml-1" />
                    </Link>

                    <div className="flex items-center gap-3">
                        {/* Price */}
                        <span className="text-green-400 font-bold text-lg">
                            ${price}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TourCard
