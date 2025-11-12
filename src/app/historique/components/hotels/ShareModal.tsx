'use client'
import { useState } from 'react'
import { FaTimes, FaCopy, FaShareAlt, FaFacebook, FaTwitter, FaWhatsapp, FaTelegram } from 'react-icons/fa'
import { SavedHotelType } from '../../data'

interface ShareModalProps {
    hotel: SavedHotelType | null
    isOpen: boolean
    onClose: () => void
}

const ShareModal = ({ hotel, isOpen, onClose }: ShareModalProps) => {
    const [copied, setCopied] = useState(false)

    if (!isOpen || !hotel) return null

    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/hotels/hotel-detail/${hotel.hotel_id}`
    const shareText = `Découvrez cet hôtel incroyable : ${hotel.name} à ${hotel.address}`

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Erreur lors de la copie:', err)
        }
    }

    const shareToSocial = (platform: string) => {
        let url = ''
        const encodedUrl = encodeURIComponent(shareUrl)
        const encodedText = encodeURIComponent(shareText)

        switch (platform) {
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
                break
            case 'twitter':
                url = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
                break
            case 'whatsapp':
                url = `https://wa.me/?text=${encodedText} ${encodedUrl}`
                break
            case 'telegram':
                url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
                break
        }

        if (url) {
            window.open(url, '_blank', 'width=600,height=400')
        }
    }

    const shareViaWebAPI = async () => {
        if (typeof navigator !== 'undefined' && 'share' in navigator) {
            try {
                await navigator.share({
                    title: hotel.name,
                    text: shareText,
                    url: shareUrl
                })
            } catch (err) {
                console.error('Erreur lors du partage:', err)
            }
        } else {
            copyToClipboard()
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#2a2c31] rounded-2xl shadow-2xl max-w-md w-full p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Partager cet hôtel
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* Hotel Info */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-[#3a3c41] rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {hotel.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {hotel.address}
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center">
                            <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-sm font-medium">{hotel.rating}</span>
                        </div>
                        <span className="text-lg font-bold text-green-600 dark:text-[#0cbc87]">
                            {hotel.currency}{Math.round(hotel.price)}
                        </span>
                    </div>
                </div>

                {/* Share URL */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Lien de partage
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={shareUrl}
                            readOnly
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-[#3a3c41] text-gray-900 dark:text-white text-sm"
                        />
                        <button
                            onClick={copyToClipboard}
                            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${copied
                                ? 'bg-green-500 text-white'
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                                }`}
                        >
                            {copied ? (
                                <>
                                    <FaCopy className="w-4 h-4 inline mr-1" />
                                    Copié !
                                </>
                            ) : (
                                <>
                                    <FaCopy className="w-4 h-4 inline mr-1" />
                                    Copier
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Social Media Buttons */}
                <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Partager sur les réseaux sociaux
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => shareToSocial('facebook')}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            <FaFacebook className="w-4 h-4" />
                            Facebook
                        </button>
                        <button
                            onClick={() => shareToSocial('twitter')}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                        >
                            <FaTwitter className="w-4 h-4" />
                            Twitter
                        </button>
                        <button
                            onClick={() => shareToSocial('whatsapp')}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                            <FaWhatsapp className="w-4 h-4" />
                            WhatsApp
                        </button>
                        <button
                            onClick={() => shareToSocial('telegram')}
                            className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        >
                            <FaTelegram className="w-4 h-4" />
                            Telegram
                        </button>
                    </div>
                </div>

                {/* Native Share Button */}
                {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <button
                        onClick={shareViaWebAPI}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                        <FaShareAlt className="w-4 h-4" />
                        Partager via l'appareil
                    </button>
                )}
            </div>
        </div>
    )
}

export default ShareModal
