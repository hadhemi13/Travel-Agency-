'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { useTranslation } from '@/hooks/useTranslation'
import { useSession, signOut } from 'next-auth/react'
import { useUserProfile } from '@/hooks/useUserProfile'
import {
    BsBell,
    BsBookmarkCheck,
    BsChevronDown,
    BsGear,
    BsHeart,
    BsInfoCircle,
    BsMoonStars,
    BsPower,
    BsSun,
} from 'react-icons/bs'
import { notificationData } from './data'


const TopNavBar = () => {
    const { theme, toggleTheme, language, toggleLanguage } = useTheme()
    const { t } = useTranslation()
    const { data: session } = useSession()
    const { user } = useUserProfile()
    const [notificationOpen, setNotificationOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [favoritesOpen, setFavoritesOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrollY, setScrollY] = useState(0)
    const pathname = usePathname()

    const notificationRef = useRef<HTMLDivElement>(null)
    const profileRef = useRef<HTMLDivElement>(null)
    const favoritesRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setNotificationOpen(false)
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false)
            }
            if (favoritesRef.current && !favoritesRef.current.contains(event.target as Node)) {
                setFavoritesOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' })
    }

    const themeModes = [
        { icon: BsSun, theme: 'light' as const, label: language === 'fr' ? 'Clair' : 'Light' },
        { icon: BsMoonStars, theme: 'dark' as const, label: language === 'fr' ? 'Sombre' : 'Dark' },
    ]

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 20 ? 'bg-[#191b1d] shadow-2xl' : 'bg-[#222529] shadow-lg'}`}>
            <nav className="max-w-[1400px] mx-auto px-6">
                <div className="flex items-center justify-between h-[75px]">
                    {/* Menu hamburger mobile - seulement sur mobile */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden flex items-center gap-2 p-2.5 text-[#b0b0b8] hover:text-white hover:bg-[#2a2c31] rounded-lg transition-all duration-300"
                        aria-label={t('nav.toggle-navigation')}
                    >
                        <div className="relative w-6 h-5 flex flex-col justify-between">
                            <span
                                className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                                    }`}
                            />
                            <span
                                className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''
                                    }`}
                            />
                            <span
                                className={`block h-0.5 bg-current rounded-full transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                                    }`}
                            />
                        </div>
                    </button>

                    {/* Logo - seulement sur desktop, à gauche */}
                    <Link href="/" className="hidden lg:flex items-center gap-3 group">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all duration-300 group-hover:shadow-[#8e85e6]/50 overflow-hidden">
                            <Image
                                src="/assets/images/bg/logo.png"
                                alt="TripMind Logo"
                                width={60}
                                height={60}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="text-white text-2xl font-bold tracking-tight">TripMind</span>
                    </Link>

                    {/* Navigation principale (Desktop) - au centre avec espacement */}
                    <div className="hidden lg:flex items-center justify-center flex-1 gap-1.5 ml-4">
                        <Link
                            href="/comparateur"
                            className={`relative px-4 py-2.5 text-[15px] font-medium transition-all duration-300 rounded-lg group ${pathname === '/comparateur' ? 'text-white bg-[#8e85e6] shadow-lg shadow-[#8e85e6]/30' : 'text-[#b0b0b8] hover:text-white hover:bg-[#2a2c31]'}`}
                        >
                            <span className="relative z-10">Comparateur</span>
                            {pathname === '/comparateur' && <span className="absolute inset-0 bg-gradient-to-r from-[#8e85e6] to-[#7a6deb] rounded-lg opacity-80"></span>}
                        </Link>

                        {/* Espacement entre Comparateur et le reste */}
                        <div className="w-2"></div>

                        <Link
                            href="/List-trip"
                            className={`relative px-4 py-2.5 text-[15px] font-medium transition-all duration-300 rounded-lg group ${pathname === '/List-trip' ? 'text-white bg-[#8e85e6] shadow-lg shadow-[#8e85e6]/30' : 'text-[#b0b0b8] hover:text-white hover:bg-[#2a2c31]'}`}
                        >
                            <span className="relative z-10">Historique</span>
                            {pathname === '/List-trip' && <span className="absolute inset-0 bg-gradient-to-r from-[#8e85e6] to-[#7a6deb] rounded-lg opacity-80"></span>}
                        </Link>


                        {/* Favoris Dropdown */}
                        <div className="relative" ref={favoritesRef}>
                            <button
                                onClick={() => setFavoritesOpen(!favoritesOpen)}
                                className={`relative px-4 py-2.5 text-[15px] font-medium transition-all duration-300 rounded-lg group flex items-center gap-2 ${pathname === '/historique/hotels' || pathname === '/historique/tours' ? 'text-white bg-[#8e85e6] shadow-lg shadow-[#8e85e6]/30' : 'text-[#b0b0b8] hover:text-white hover:bg-[#2a2c31]'}`}
                            >
                                <span className="relative z-10">Favoris</span>
                                <BsChevronDown className={`text-xs transition-transform duration-300 ${favoritesOpen ? 'rotate-180' : ''}`} />
                                {(pathname === '/historique/hotels' || pathname === '/historique/tours') && <span className="absolute inset-0 bg-gradient-to-r from-[#8e85e6] to-[#7a6deb] rounded-lg opacity-80"></span>}
                            </button>

                            {/* Dropdown Menu */}
                            {favoritesOpen && (
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#222529] rounded-xl shadow-2xl dark:shadow-[0_1rem_3rem_rgba(0,0,0,0.5)] border border-gray-200 dark:border-[rgba(255,255,255,0.07)] animate-fadeIn overflow-hidden backdrop-blur-lg z-50">
                                    <div className="py-2">
                                        <Link
                                            href="/historique/hotels"
                                            className={`flex items-center gap-3 px-4 py-3 text-[15px] font-medium transition-all duration-300 hover:bg-gray-100 dark:hover:bg-[#2a2c31] ${pathname === '/historique/hotels' ? 'text-[#8e85e6] bg-[#8e85e6]/10' : 'text-gray-700 dark:text-[#b0b0b8]'}`}
                                            onClick={() => setFavoritesOpen(false)}
                                        >
                                            <span className="text-lg">🏨</span>
                                            <span>Hotels</span>
                                        </Link>
                                        <Link
                                            href="/historique/tours"
                                            className={`flex items-center gap-3 px-4 py-3 text-[15px] font-medium transition-all duration-300 hover:bg-gray-100 dark:hover:bg-[#2a2c31] ${pathname === '/historique/tours' ? 'text-[#8e85e6] bg-[#8e85e6]/10' : 'text-gray-700 dark:text-[#b0b0b8]'}`}
                                            onClick={() => setFavoritesOpen(false)}
                                        >
                                            <span className="text-lg">🗺️</span>
                                            <span>Tours</span>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Link
                            href="/user-profile/profile"
                            className={`relative px-4 py-2.5 text-[15px] font-medium transition-all duration-300 rounded-lg group ${pathname === '/user-profile/profile' ? 'text-white bg-[#8e85e6] shadow-lg shadow-[#8e85e6]/30' : 'text-[#b0b0b8] hover:text-white hover:bg-[#2a2c31]'}`}
                        >
                            <span className="relative z-10">Profile</span>
                            {pathname === '/user-profile/profile' && <span className="absolute inset-0 bg-gradient-to-r from-[#8e85e6] to-[#7a6deb] rounded-lg opacity-80"></span>}
                        </Link>
                        
                        <Link
                            href="/generate-trip"
                            className={`relative px-4 py-2.5 text-[15px] font-medium transition-all duration-300 rounded-lg group ${pathname === '/generate-trip' ? 'text-white bg-[#8e85e6] shadow-lg shadow-[#8e85e6]/30' : 'text-[#b0b0b8] hover:text-white hover:bg-[#2a2c31]'}`}
                        >
                            <span className="relative z-10">suggestions</span>
                            {pathname === '/generate-trip' && <span className="absolute inset-0 bg-gradient-to-r from-[#8e85e6] to-[#7a6deb] rounded-lg opacity-80"></span>}
                        </Link>
                    </div>

                    {/* Actions de droite */}
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setNotificationOpen(!notificationOpen)}
                                className="relative p-2.5 text-[#b0b0b8] hover:text-white hover:bg-[#2a2c31] rounded-xl transition-all duration-300 hover:scale-105"
                                aria-label={t('nav.notifications')}
                            >
                                <BsBell className="text-xl" />
                                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse ring-2 ring-red-500/30" />
                            </button>

                            {/* Dropdown Notifications */}
                            {notificationOpen && (
                                <div className="absolute right-0 mt-3 w-96 bg-white dark:bg-[#222529] rounded-2xl shadow-2xl dark:shadow-[0_1rem_3rem_rgba(0,0,0,0.5)] border border-gray-200 dark:border-[rgba(255,255,255,0.07)] animate-fadeIn overflow-hidden backdrop-blur-lg">
                                    <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-[rgba(255,255,255,0.07)] bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#2a2c31] dark:to-[#2a2c31]">
                                        <h6 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2">
                                            <BsBell className="text-blue-600 dark:text-[#8e85e6]" />
                                            {t('nav.notifications')}
                                            <span className="ml-2 px-3 py-1 text-xs bg-red-500 text-white rounded-full font-semibold shadow-lg">
                                                {notificationData.length}
                                            </span>
                                        </h6>
                                        <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 dark:text-[#8e85e6] dark:hover:text-[#7a6deb] font-semibold hover:underline transition-all">
                                            Effacer
                                        </Link>
                                    </div>

                                    <div className="max-h-96 overflow-y-auto p-3 space-y-2">
                                        {notificationData.map((notification, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-[#2a2c31] transition-all duration-300 cursor-pointer border-l-4 ${idx === 0 ? 'bg-blue-50 dark:bg-[#8e85e6]/10 border-blue-500 dark:border-[#8e85e6]' : 'bg-white dark:bg-[#191b1d] border-transparent hover:border-blue-300 dark:hover:border-[#8e85e6]'
                                                    } shadow-sm hover:shadow-md`}
                                            >
                                                <h6 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">
                                                    {notification.title}
                                                </h6>
                                                {notification.content && (
                                                    <p className="text-xs text-gray-600 dark:text-[#b0b0b8] mb-2 leading-relaxed">{notification.content}</p>
                                                )}
                                                <span className="text-xs text-gray-500 dark:text-[#a1a1a8] font-medium">{notification.time}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-4 border-t border-gray-200 dark:border-[rgba(255,255,255,0.07)] text-center bg-gray-50 dark:bg-[#191b1d]">
                                        <Link
                                            href="#"
                                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-[#8e85e6] dark:hover:text-[#7a6deb] font-bold hover:underline transition-all inline-flex items-center gap-2"
                                        >
                                            Voir toutes les activités
                                            <span className="text-lg">→</span>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown or Login Button */}
                        {session ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="w-11 h-11 rounded-xl overflow-hidden hover:ring-4 hover:ring-[#8e85e6]/50 transition-all duration-300 ml-2 hover:scale-105 shadow-lg"
                                    aria-label={t('nav.profile')}
                                >
                                    <Image
                                        src={user?.profileImage || session?.user?.image || "/assets/images/avatar/01.jpg"}
                                        alt="avatar"
                                        width={44}
                                        height={44}
                                        className="w-full h-full object-cover"
                                    />
                                </button>

                                {/* Dropdown Profile */}
                                {profileOpen && (
                                    <div className="absolute right-0 mt-3 w-72 bg-gray-900 dark:bg-[#222529] rounded-2xl shadow-2xl dark:shadow-[0_1rem_3rem_rgba(0,0,0,0.5)] border border-gray-700 dark:border-[rgba(255,255,255,0.07)] animate-fadeIn overflow-hidden backdrop-blur-lg">
                                        <div className="p-5 border-b border-gray-700 dark:border-[rgba(255,255,255,0.07)] bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-[#8e85e6] dark:to-[#7a6deb]">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <Image
                                                        src={user?.profileImage || session?.user?.image || "/assets/images/avatar/01.jpg"}
                                                        alt="avatar"
                                                        width={56}
                                                        height={56}
                                                        className="w-14 h-14 rounded-full object-cover shadow-lg ring-4 ring-white/20"
                                                    />
                                                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-[#0cbc87] rounded-full border-2 border-[#8e85e6]"></span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h6 className="font-bold text-white text-base truncate mb-1">
                                                        {user?.name || session?.user?.name || t('common.user')}
                                                    </h6>
                                                    <p className="text-xs text-blue-100 truncate">
                                                        {user?.email || session?.user?.email || t('common.email-not-defined')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="py-3 px-2">
                                            <Link
                                                href="#"
                                                className="flex items-center gap-3 px-4 py-3 text-[15px] text-gray-200 dark:text-[#b0b0b8] hover:bg-gray-800 dark:hover:bg-[#2a2c31] rounded-xl transition-all duration-300 font-medium hover:translate-x-1"
                                            >
                                                <BsBookmarkCheck className="text-lg text-blue-400 dark:text-[#8e85e6]" />
                                                <span>{t('nav.my-bookings')}</span>
                                            </Link>
                                            <Link
                                                href="#"
                                                className="flex items-center gap-3 px-4 py-3 text-[15px] text-gray-200 dark:text-[#b0b0b8] hover:bg-gray-800 dark:hover:bg-[#2a2c31] rounded-xl transition-all duration-300 font-medium hover:translate-x-1"
                                            >
                                                <BsHeart className="text-lg text-red-400" />
                                                <span>{t('nav.wishlist')}</span>
                                            </Link>
                                            <Link
                                                href="#"
                                                className="flex items-center gap-3 px-4 py-3 text-[15px] text-gray-200 dark:text-[#b0b0b8] hover:bg-gray-800 dark:hover:bg-[#2a2c31] rounded-xl transition-all duration-300 font-medium hover:translate-x-1"
                                            >
                                                <BsGear className="text-lg text-purple-400 dark:text-[#8e85e6]" />
                                                <span>{t('nav.settings')}</span>
                                            </Link>
                                            <Link
                                                href="#"
                                                className="flex items-center gap-3 px-4 py-3 text-[15px] text-gray-200 dark:text-[#b0b0b8] hover:bg-gray-800 dark:hover:bg-[#2a2c31] rounded-xl transition-all duration-300 font-medium hover:translate-x-1"
                                            >
                                                <BsInfoCircle className="text-lg text-green-400 dark:text-[#0cbc87]" />
                                                <span>{t('nav.help-center')}</span>
                                            </Link>
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center gap-3 px-4 py-3 text-[15px] text-red-400 dark:text-red-400 hover:bg-red-500/20 dark:hover:bg-red-800/30 rounded-xl transition-all duration-300 font-semibold hover:translate-x-1"
                                            >
                                                <BsPower className="text-lg" />
                                                <span>{t('nav.logout')}</span>
                                            </button>
                                        </div>

                                        <div className="p-4 border-t border-gray-700 dark:border-[rgba(255,255,255,0.07)] bg-gray-800/50 dark:bg-[#191b1d]">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-sm text-gray-200 dark:text-white font-semibold">{t('nav.mode')}</span>
                                                <div className="flex items-center gap-2 bg-gray-700 dark:bg-[#2a2c31] p-1 rounded-xl">
                                                    {themeModes.map((mode) => {
                                                        const Icon = mode.icon
                                                        return (
                                                            <button
                                                                key={mode.theme}
                                                                onClick={() => {
                                                                    if (mode.theme !== theme) {
                                                                        toggleTheme()
                                                                    }
                                                                }}
                                                                className={`p-2 rounded-lg transition-all duration-300 ${theme === mode.theme
                                                                    ? 'bg-gradient-to-br from-[#8e85e6] to-[#7a6deb] text-white shadow-lg'
                                                                    : 'text-[#a1a1a8] hover:text-white hover:bg-[#464950]'
                                                                    }`}
                                                                title={mode.label}
                                                            >
                                                                <Icon className="text-base" />
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-200 dark:text-white font-semibold">{t('nav.language')}</span>
                                                <div className="flex items-center gap-2 bg-gray-700 dark:bg-[#2a2c31] p-1 rounded-xl">
                                                    <button
                                                        onClick={() => {
                                                            if (language !== 'fr') {
                                                                toggleLanguage()
                                                            }
                                                        }}
                                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${language === 'fr'
                                                            ? 'bg-gradient-to-br from-[#8e85e6] to-[#7a6deb] text-white shadow-lg'
                                                            : 'text-[#a1a1a8] hover:text-white hover:bg-[#464950]'
                                                            }`}
                                                    >
                                                        FR
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (language !== 'en') {
                                                                toggleLanguage()
                                                            }
                                                        }}
                                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${language === 'en'
                                                            ? 'bg-gradient-to-br from-[#8e85e6] to-[#7a6deb] text-white shadow-lg'
                                                            : 'text-[#a1a1a8] hover:text-white hover:bg-[#464950]'
                                                            }`}
                                                    >
                                                        EN
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#8e85e6] dark:to-[#8e85e6] hover:from-blue-700 hover:to-indigo-700 dark:hover:from-[#7a6deb] dark:hover:to-[#7a6deb] text-white rounded-xl transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                {language === 'fr' ? 'Connexion' : 'Login'}
                            </Link>
                        )}
                    </div>
                </div>

                {/* Menu Mobile */}
                {mobileMenuOpen && (
                    <div className="lg:hidden py-5 border-t border-gray-700 dark:border-[rgba(255,255,255,0.07)] animate-slideDown bg-gradient-to-b from-[#222529] to-[#191b1d]">
                        <div className="space-y-2">
                            {/* Menu Links Mobile */}
                            <div>
                                <p className="text-xs text-[#a1a1a8] mb-3 px-3 font-bold uppercase tracking-wider">{t('nav.menu')}</p>
                                <Link
                                    href="/comparateur"
                                    className={`block px-5 py-3.5 font-medium rounded-xl transition-all duration-300 ${pathname === '/comparateur' ? 'text-white bg-gradient-to-r from-[#8e85e6] to-[#7a6deb] shadow-lg' : 'text-[#b0b0b8] hover:text-white hover:bg-[#2a2c31]'}`}
                                >
                                    Comparateur
                                </Link>
                                {/* Favoris Mobile */}
                                <div className="px-5 py-3.5">
                                    <p className="text-sm font-semibold text-[#8e85e6] mb-2">Favoris</p>
                                    <div className="ml-4 space-y-1">
                                        <Link
                                            href="/historique/hotels"
                                            className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${pathname === '/historique/hotels' ? 'text-white bg-gradient-to-r from-[#8e85e6] to-[#7a6deb] shadow-lg' : 'text-[#b0b0b8] hover:text-white hover:bg-[#2a2c31]'}`}
                                        >
                                            🏨 Hotels
                                        </Link>
                                        <Link
                                            href="/historique/tours"
                                            className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${pathname === '/historique/tours' ? 'text-white bg-gradient-to-r from-[#8e85e6] to-[#7a6deb] shadow-lg' : 'text-[#b0b0b8] hover:text-white hover:bg-[#2a2c31]'}`}
                                        >
                                            🗺️ Tours
                                        </Link>
                                    </div>
                                </div>
                                <Link
                                    href="/List-trip"
                                    className={`block px-5 py-3.5 font-medium rounded-xl transition-all duration-300 ${pathname === '/List-trip' ? 'text-white bg-gradient-to-r from-[#8e85e6] to-[#7a6deb] shadow-lg' : 'text-[#b0b0b8] hover:text-white hover:bg-[#2a2c31]'}`}
                                >
                                    Historique
                                </Link>
                                <Link
                                    href="/hotels"
                                    className={`block px-5 py-3.5 font-medium rounded-xl transition-all duration-300 ${pathname === '/hotels' ? 'text-white bg-gradient-to-r from-[#8e85e6] to-[#7a6deb] shadow-lg' : 'text-[#b0b0b8] hover:text-white hover:bg-[#2a2c31]'}`}
                                >
                                    Hotels
                                </Link>
                                <Link
                                    href="/user-profile/profile"
                                    className={`block px-5 py-3.5 font-medium rounded-xl transition-all duration-300 ${pathname === '/user-profile/profile' ? 'text-white bg-gradient-to-r from-[#8e85e6] to-[#7a6deb] shadow-lg' : 'text-[#b0b0b8] hover:text-white hover:bg-[#2a2c31]'}`}
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/reservations"
                                    className={`block px-5 py-3.5 font-medium rounded-xl transition-all duration-300 ${pathname === '/reservations' ? 'text-white bg-gradient-to-r from-[#8e85e6] to-[#7a6deb] shadow-lg' : 'text-[#b0b0b8] hover:text-white hover:bg-[#2a2c31]'}`}
                                >
                                    Réservation
                                </Link>
                                <Link
                                    href="/generate-trip"
                                    className={`block px-5 py-3.5 font-medium rounded-xl transition-all duration-300 ${pathname === '/generate-trip' ? 'text-white bg-gradient-to-r from-[#8e85e6] to-[#7a6deb] shadow-lg' : 'text-[#b0b0b8] hover:text-white hover:bg-[#2a2c31]'}`}
                                >
                                    suggestions
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    )
}

export default TopNavBar
