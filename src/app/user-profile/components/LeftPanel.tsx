'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { BsPencilSquare, BsPerson, BsTicketPerforated, BsPeople, BsWallet, BsHeart, BsGear, BsTrash } from 'react-icons/bs'
import { FaSignOutAlt } from 'react-icons/fa'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useTranslation } from '@/hooks/useTranslation'

const LeftPanel = () => {
    const pathname = usePathname()
    const { user, status } = useUserProfile()
    const { t } = useTranslation()

    const menuItems = [
        {
            key: 'acc-profile',
            label: t('profile.title'),
            url: '/user-profile/profile',
            icon: BsPerson,
        },
        {
            key: 'acc-user-booking',
            label: t('nav.my-bookings'),
            url: '/user-profile/booking',
            icon: BsTicketPerforated,
        },
        {
            key: 'acc-user-travelers',
            label: t('nav.travelers'),
            url: '/user-profile/travelers',
            icon: BsPeople,
        },
        {
            key: 'acc-user-payment-detail',
            label: t('nav.payment-details'),
            url: '/user-profile/payment-detail',
            icon: BsWallet,
        },
        {
            key: 'acc-user-wishlist',
            label: t('nav.wishlist'),
            url: '/user-profile/wishlist',
            icon: BsHeart,
        },
        {
            key: 'acc-user-favorites',
            label: 'Mes Programmes Favoris',
            url: '/user-profile/favorites',
            icon: BsHeart,
        },
        {
            key: 'acc-user-settings',
            label: t('nav.settings'),
            url: '/user-profile/settings',
            icon: BsGear,
        },
        {
            key: 'acc-user-delete',
            label: t('nav.delete-profile'),
            url: '/user-profile/delete-profile',
            icon: BsTrash,
        },
    ]

    const handleSignOut = () => {
        signOut({ callbackUrl: '/' })
    }

    if (status === 'loading') {
        return (
            <div className="bg-white dark:bg-[#2a2c31] rounded-lg shadow-sm border border-gray-200 dark:border-[rgba(255,255,255,0.07)] w-full">
                <div className="p-6">
                    <div className="animate-pulse">
                        <div className="h-20 w-20 bg-gray-300 dark:bg-[#464950] rounded-full mx-auto mb-4"></div>
                        <div className="h-4 bg-gray-300 dark:bg-[#464950] rounded mb-2"></div>
                        <div className="h-3 bg-gray-300 dark:bg-[#464950] rounded mb-6"></div>
                        <div className="space-y-2">
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className="h-10 bg-gray-300 dark:bg-[#464950] rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-[#2a2c31] rounded-lg shadow-sm border border-gray-200 dark:border-[rgba(255,255,255,0.07)] w-full">
            {/* Edit Profile Button */}
            <div className="absolute top-4 right-4">
                <button
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-[#a1a1a8] hover:bg-gray-100 dark:hover:bg-[#2a2c31] rounded-lg transition-colors"
                    title="Modifier le profil"
                >
                    <BsPencilSquare />
                </button>
            </div>

            <div className="p-6">
                {/* User Info */}
                <div className="text-center mb-6">
                    <div className="relative inline-block mb-4">
                        <Image
                            src={user?.profileImage || '/assets/images/avatar/01.jpg'}
                            alt="Avatar"
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full border-4 border-white dark:border-[#2a2c31] shadow-lg object-cover"
                        />
                    </div>
                    <h6 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                        {user?.name || t('common.user')}
                    </h6>
                    <Link
                        href={`mailto:${user?.email || ''}`}
                        className="text-gray-400 dark:text-gray-400 hover:text-gray-300 dark:hover:text-gray-300 text-sm transition-colors"
                    >
                        {user?.email || t('common.email-not-defined')}
                    </Link>
                </div>

                <hr className="border-gray-200 dark:border-[rgba(255,255,255,0.07)] mb-6" />

                {/* Navigation Menu */}
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.url

                        return (
                            <Link
                                key={item.key}
                                href={item.url}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-[#8e85e6] dark:bg-[#8e85e6] text-white dark:text-white'
                                    : 'text-white dark:text-white hover:bg-gray-600 dark:hover:bg-gray-600'
                                    }`}
                            >
                                <Icon className={`text-lg ${isActive ? 'text-white dark:text-white' : 'text-white dark:text-white'}`} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        )
                    })}

                    {/* Sign Out */}
                    <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300 rounded-lg transition-colors"
                    >
                        <FaSignOutAlt className="text-lg" />
                        <span className="font-medium">{t('nav.logout')}</span>
                    </button>
                </nav>
            </div>
        </div>
    )
}

export default LeftPanel
