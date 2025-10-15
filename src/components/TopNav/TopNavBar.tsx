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
    BsCircleHalf,
    BsGear,
    BsHeart,
    BsInfoCircle,
    BsMoonStars,
    BsPower,
    BsSun,
    BsThreeDots,
} from 'react-icons/bs'
import { FaHotel, FaPlane, FaGlobeAmericas, FaTaxi, FaChevronDown } from 'react-icons/fa'
import { notificationData } from './data'


const TopNavBar = () => {
    const { theme, toggleTheme, language, toggleLanguage } = useTheme()
    const { t } = useTranslation()
    const { data: session } = useSession()
    const { user } = useUserProfile()
    const [listingsOpen, setListingsOpen] = useState(false)
    const [pagesOpen, setPagesOpen] = useState(false)
    const [accountsOpen, setAccountsOpen] = useState(false)
    const [moreOpen, setMoreOpen] = useState(false)
    const [notificationOpen, setNotificationOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrollY, setScrollY] = useState(0)
    const pathname = usePathname()

    const notificationRef = useRef<HTMLDivElement>(null)
    const profileRef = useRef<HTMLDivElement>(null)
    const listingsRef = useRef<HTMLDivElement>(null)
    const pagesRef = useRef<HTMLDivElement>(null)
    const accountsRef = useRef<HTMLDivElement>(null)
    const moreRef = useRef<HTMLDivElement>(null)

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
            if (listingsRef.current && !listingsRef.current.contains(event.target as Node)) {
                setListingsOpen(false)
            }
            if (pagesRef.current && !pagesRef.current.contains(event.target as Node)) {
                setPagesOpen(false)
            }
            if (accountsRef.current && !accountsRef.current.contains(event.target as Node)) {
                setAccountsOpen(false)
            }
            if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
                setMoreOpen(false)
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
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#2b3139] shadow-lg">
            <nav className="max-w-[1320px] mx-auto px-4">
                <div className="flex items-center justify-between h-[70px]">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                            <FaPlane className="text-white text-lg rotate-45" />
                        </div>
                        <span className="text-white text-xl font-semibold tracking-tight">{t('nav.booking')}</span>
                    </Link>

                    {/* Menu hamburger mobile */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden flex items-center gap-2 p-2 text-gray-300 hover:text-white transition-colors"
                        aria-label={t('nav.toggle-navigation')}
                    >
                        <div className="relative w-6 h-5 flex flex-col justify-between">
                            <span
                                className={`block h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                                    }`}
                            />
                            <span
                                className={`block h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''
                                    }`}
                            />
                            <span
                                className={`block h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                                    }`}
                            />
                        </div>
                    </button>

                    {/* Navigation principale (Desktop) */}
                    <div className="hidden lg:flex items-center flex-1 ml-10 gap-1">
                        {/* Listings Dropdown */}
                        <div className="relative" ref={listingsRef}>
                            <button
                                onClick={() => {
                                    setListingsOpen(!listingsOpen)
                                    setPagesOpen(false)
                                    setAccountsOpen(false)
                                    setMoreOpen(false)
                                }}
                                className="flex items-center gap-1.5 px-3 py-2 text-[15px] text-gray-300 hover:text-white transition-colors rounded-md hover:bg-white/5"
                            >
                                {t('nav.listings')}
                                <FaChevronDown
                                    className={`text-[10px] transition-transform duration-200 ${listingsOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {listingsOpen && (
                                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-fadeIn overflow-hidden">
                                    <Link
                                        href="/hotels"
                                        className="block px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                    >
                                        Hôtels
                                    </Link>
                                    <Link
                                        href="/flights"
                                        className="block px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                    >
                                        Vols
                                    </Link>
                                    <Link
                                        href="/tours"
                                        className="block px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                    >
                                        {t('nav.tours')}
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Pages Dropdown */}
                        <div className="relative" ref={pagesRef}>
                            <button
                                onClick={() => {
                                    setPagesOpen(!pagesOpen)
                                    setListingsOpen(false)
                                    setAccountsOpen(false)
                                    setMoreOpen(false)
                                }}
                                className="flex items-center gap-1.5 px-3 py-2 text-[15px] text-gray-300 hover:text-white transition-colors rounded-md hover:bg-white/5"
                            >
                                {t('nav.pages')}
                                <FaChevronDown
                                    className={`text-[10px] transition-transform duration-200 ${pagesOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {pagesOpen && (
                                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-fadeIn overflow-hidden">
                                    <Link
                                        href="/about"
                                        className="block px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                    >
                                        À propos
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="block px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                    >
                                        Contact
                                    </Link>
                                    <Link
                                        href="/faq"
                                        className="block px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                    >
                                        FAQ
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Accounts Dropdown */}
                        <div className="relative" ref={accountsRef}>
                            <button
                                onClick={() => {
                                    setAccountsOpen(!accountsOpen)
                                    setListingsOpen(false)
                                    setPagesOpen(false)
                                    setMoreOpen(false)
                                }}
                                className="flex items-center gap-1.5 px-3 py-2 text-[15px] text-gray-300 hover:text-white transition-colors rounded-md hover:bg-white/5"
                            >
                                {t('nav.accounts')}
                                <FaChevronDown
                                    className={`text-[10px] transition-transform duration-200 ${accountsOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {accountsOpen && (
                                <div className="absolute top-full left-0 mt-1 w-52 bg-[#2b3139] rounded-lg shadow-xl border border-gray-600 py-2 animate-fadeIn overflow-hidden">
                                    <Link
                                        href="/user-profile/profile"
                                        className="flex items-center justify-between px-4 py-2.5 text-[15px] text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        <span>{t('nav.user-profile')}</span>
                                        <BsThreeDots className="text-sm text-gray-400" />
                                    </Link>

                                    <Link
                                        href="/agent-dashboard"
                                        className="flex items-center justify-between px-4 py-2.5 text-[15px] text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        <span>{t('nav.agent-dashboard')}</span>
                                        <BsThreeDots className="text-sm text-gray-400" />
                                    </Link>
                                    <Link
                                        href="/master-admin"
                                        className="flex items-center justify-between px-4 py-2.5 text-[15px] text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        <span>{t('nav.master-admin')}</span>
                                        <BsThreeDots className="text-sm text-gray-400" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* More Button (Three Dots) */}
                        <div className="relative" ref={moreRef}>
                            <button
                                onClick={() => {
                                    setMoreOpen(!moreOpen)
                                    setListingsOpen(false)
                                    setPagesOpen(false)
                                    setAccountsOpen(false)
                                }}
                                className="p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                                aria-label="Plus d'options"
                            >
                                <BsThreeDots className="text-xl" />
                            </button>

                            {moreOpen && (
                                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-fadeIn overflow-hidden">
                                    <Link
                                        href="/blog"
                                        className="block px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                    >
                                        Blog
                                    </Link>
                                    <Link
                                        href="/help"
                                        className="block px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                    >
                                        Aide
                                    </Link>
                                    <Link
                                        href="/terms"
                                        className="block px-4 py-2.5 text-[15px] text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                    >
                                        Conditions
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions de droite */}
                    <div className="flex items-center gap-2">
                        {/* Catégories (Desktop) */}
                        <div className="hidden lg:flex items-center gap-1 mr-2">
                            <Link
                                href="/hotels"
                                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-all group"
                            >
                                <FaHotel className="text-base group-hover:scale-110 transition-transform" />
                                <span className="text-[15px] font-medium">{t('nav.hotel')}</span>
                            </Link>
                            <Link
                                href="/flights"
                                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-all group"
                            >
                                <FaPlane className="text-base group-hover:scale-110 transition-transform" />
                                <span className="text-[15px] font-medium">{t('nav.flight')}</span>
                            </Link>
                            <Link
                                href="/tours"
                                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-all group"
                            >
                                <FaGlobeAmericas className="text-base group-hover:scale-110 transition-transform" />
                                <span className="text-[15px] font-medium">{t('nav.tour')}</span>
                            </Link>
                            <Link
                                href="/cabs"
                                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-all group"
                            >
                                <FaTaxi className="text-base group-hover:scale-110 transition-transform" />
                                <span className="text-[15px] font-medium">{t('nav.cab')}</span>
                            </Link>
                        </div>

                        {/* Divider */}
                        <div className="hidden lg:block w-px h-6 bg-gray-600/50 mx-1" />

                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setNotificationOpen(!notificationOpen)}
                                className="relative p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors"
                                aria-label={t('nav.notifications')}
                            >
                                <BsBell className="text-xl" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            </button>

                            {/* Dropdown Notifications */}
                            {notificationOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 animate-fadeIn">
                                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                                        <h6 className="font-semibold text-gray-800 text-[15px]">
                                            {t('nav.notifications')}{' '}
                                            <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full font-medium">
                                                {notificationData.length} nouvelles
                                            </span>
                                        </h6>
                                        <Link href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                            Tout effacer
                                        </Link>
                                    </div>

                                    <div className="max-h-80 overflow-y-auto p-2">
                                        {notificationData.map((notification, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-3 rounded-lg mb-2 hover:bg-gray-50 transition-colors cursor-pointer ${idx === 0 ? 'bg-blue-50' : ''
                                                    }`}
                                            >
                                                <h6 className="text-sm font-semibold text-gray-800 mb-1">
                                                    {notification.title}
                                                </h6>
                                                {notification.content && (
                                                    <p className="text-xs text-gray-600 mb-1">{notification.content}</p>
                                                )}
                                                <span className="text-xs text-gray-500">{notification.time}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-3 border-t border-gray-200 text-center">
                                        <Link
                                            href="#"
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Voir toutes les activités
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
                                    className="w-10 h-10 rounded-xl overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all ml-1"
                                    aria-label={t('nav.profile')}
                                >
                                    <Image
                                        src={user?.profileImage || session?.user?.image || "/assets/images/avatar/01.jpg"}
                                        alt="avatar"
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                    />
                                </button>

                                {/* Dropdown Profile */}
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-gray-900 dark:bg-gray-800 rounded-lg shadow-xl border border-gray-700 dark:border-gray-600 animate-fadeIn">
                                        <div className="p-4 border-b border-gray-700 dark:border-gray-600">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={user?.profileImage || session?.user?.image || "/assets/images/avatar/01.jpg"}
                                                    alt="avatar"
                                                    width={48}
                                                    height={48}
                                                    className="w-12 h-12 rounded-full object-cover shadow"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h6 className="font-semibold text-white dark:text-gray-100 text-sm truncate">
                                                        {user?.name || session?.user?.name || t('common.user')}
                                                    </h6>
                                                    <p className="text-xs text-gray-300 dark:text-gray-400 truncate">
                                                        {user?.email || session?.user?.email || t('common.email-not-defined')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="py-2">
                                            <Link
                                                href="#"
                                                className="flex items-center gap-3 px-4 py-2.5 text-[15px] text-gray-200 dark:text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <BsBookmarkCheck className="text-base" />
                                                <span>{t('nav.my-bookings')}</span>
                                            </Link>
                                            <Link
                                                href="#"
                                                className="flex items-center gap-3 px-4 py-2.5 text-[15px] text-gray-200 dark:text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <BsHeart className="text-base" />
                                                <span>{t('nav.wishlist')}</span>
                                            </Link>
                                            <Link
                                                href="#"
                                                className="flex items-center gap-3 px-4 py-2.5 text-[15px] text-gray-200 dark:text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <BsGear className="text-base" />
                                                <span>{t('nav.settings')}</span>
                                            </Link>
                                            <Link
                                                href="#"
                                                className="flex items-center gap-3 px-4 py-2.5 text-[15px] text-gray-200 dark:text-gray-300 hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <BsInfoCircle className="text-base" />
                                                <span>{t('nav.help-center')}</span>
                                            </Link>
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-[15px] text-red-400 dark:text-red-300 hover:bg-red-900/30 dark:hover:bg-red-800/30 transition-colors"
                                            >
                                                <BsPower className="text-base" />
                                                <span>{t('nav.logout')}</span>
                                            </button>
                                        </div>

                                        <div className="p-4 border-t border-gray-700 dark:border-gray-600">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm text-gray-200 dark:text-gray-300 font-medium">{t('nav.mode')} :</span>
                                                <div className="flex items-center gap-1">
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
                                                                className={`p-2 rounded-lg transition-colors ${theme === mode.theme
                                                                    ? 'bg-purple-600 text-white'
                                                                    : 'text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-600'
                                                                    }`}
                                                                title={mode.label}
                                                            >
                                                                <Icon className="text-sm" />
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-200 dark:text-gray-300 font-medium">{t('nav.language')} :</span>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => {
                                                            if (language !== 'fr') {
                                                                toggleLanguage()
                                                            }
                                                        }}
                                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${language === 'fr'
                                                            ? 'bg-purple-600 text-white'
                                                            : 'text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-600'
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
                                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${language === 'en'
                                                            ? 'bg-purple-600 text-white'
                                                            : 'text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-600'
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
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                            >
                                {language === 'fr' ? 'Connexion' : 'Login'}
                            </Link>
                        )}
                    </div>
                </div>

                {/* Menu Mobile */}
                {mobileMenuOpen && (
                    <div className="lg:hidden py-4 border-t border-gray-700 animate-slideDown">
                        <div className="space-y-3">
                            {/* Catégories Mobile */}
                            <div className="mb-4">
                                <p className="text-xs text-gray-400 mb-2 px-2 font-semibold uppercase tracking-wider">Catégories</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        href="/hotels"
                                        className="flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white"
                                    >
                                        <FaHotel className="text-base" />
                                        <span className="font-medium">{t('nav.hotel')}</span>
                                    </Link>
                                    <Link
                                        href="/flights"
                                        className="flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white"
                                    >
                                        <FaPlane className="text-base" />
                                        <span className="font-medium">{t('nav.flight')}</span>
                                    </Link>
                                    <Link
                                        href="/tours"
                                        className="flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white"
                                    >
                                        <FaGlobeAmericas className="text-base" />
                                        <span className="font-medium">{t('nav.tour')}</span>
                                    </Link>
                                    <Link
                                        href="/cabs"
                                        className="flex items-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-white"
                                    >
                                        <FaTaxi className="text-base" />
                                        <span className="font-medium">{t('nav.cab')}</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Menu Links Mobile */}
                            <div>
                                <p className="text-xs text-gray-400 mb-2 px-2 font-semibold uppercase tracking-wider">{t('nav.menu')}</p>
                                <Link
                                    href="/hotels"
                                    className="block px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    {t('nav.listings')}
                                </Link>
                                <Link
                                    href="/about"
                                    className="block px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    {t('nav.pages')}
                                </Link>
                                <Link
                                    href="/login"
                                    className="block px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    Accounts
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
