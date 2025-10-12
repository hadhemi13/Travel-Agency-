'use client'
import { currency } from '@/states'
import Image from 'next/image'
import Link from 'next/link'
import { BsGeoAlt } from 'react-icons/bs'
import { FaCopy, FaFacebookSquare, FaHeart, FaLinkedin, FaShareAlt, FaStar, FaStarHalfAlt, FaTwitterSquare } from 'react-icons/fa'
import { type WishCardType } from '../data.js'

const WishCard = ({ wishCard }: { wishCard: WishCardType }) => {
    const { address, image, name, price, rating } = wishCard
    return (
        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-4">
            <div className="flex">
                {/* Image */}
                <div className="w-80 h-48 flex-shrink-0">
                    <Image
                        src={image}
                        className="w-full h-full object-cover"
                        alt={`Image of ${name}`}
                        width={320}
                        height={192}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                    {/* Top section with rating and actions */}
                    <div className="flex justify-between items-start mb-4">
                        {/* Rating */}
                        <div className="flex items-center gap-1">
                            {Array.from(new Array(Math.floor(rating))).map((_star, idx) => (
                                <FaStar key={idx} size={16} className="text-yellow-400" />
                            ))}
                            {!Number.isInteger(rating) && (
                                <FaStarHalfAlt size={15} className="text-yellow-400" />
                            )}
                            {rating < 5 &&
                                Array.from(new Array(5 - Math.ceil(rating))).map((_val, idx) => (
                                    <FaStar key={idx} size={16} className="text-gray-500" />
                                ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-red-500 hover:text-red-400 transition-colors">
                                <FaHeart size={16} />
                            </button>
                            <div className="relative group">
                                <button className="p-2 text-gray-400 hover:text-gray-300 transition-colors">
                                    <FaShareAlt size={16} />
                                </button>
                                <div className="absolute right-0 top-full mt-2 w-48 bg-gray-700 rounded-lg shadow-lg border border-gray-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=Check%20out%20${encodeURIComponent(name)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 first:rounded-t-lg"
                                    >
                                        <FaTwitterSquare className="text-blue-400" />
                                        Twitter
                                    </a>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(image)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                                    >
                                        <FaFacebookSquare className="text-blue-600" />
                                        Facebook
                                    </a>
                                    <a
                                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(image)}&title=${encodeURIComponent(name)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                                    >
                                        <FaLinkedin className="text-blue-700" />
                                        LinkedIn
                                    </a>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(window.location.href)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 w-full text-left last:rounded-b-lg"
                                    >
                                        <FaCopy />
                                        Copier le lien
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2">
                        <Link href="/hotels/hotel-detail" className="hover:text-gray-300 transition-colors">
                            {name}
                        </Link>
                    </h3>

                    {/* Address */}
                    <div className="flex items-center text-gray-400 mb-6">
                        <BsGeoAlt className="mr-2" size={14} />
                        <span className="text-sm">{address}</span>
                    </div>

                    {/* Bottom section with price and action */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-white">
                                {currency}{price}
                            </span>
                            <span className="text-gray-400 ml-1">/day</span>
                        </div>
                        <Link
                            href="/hotels/hotel-detail"
                            className="px-6 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                        >
                            View hotel
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WishCard