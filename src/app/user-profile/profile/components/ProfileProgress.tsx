'use client'
import Link from 'next/link'
import { BsCheckCircleFill, BsPlusCircleFill } from 'react-icons/bs'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useTranslation } from '@/hooks/useTranslation'

const ProfileProgress = () => {
    const { user } = useUserProfile()
    const { t } = useTranslation()

    const completionPercentage = user?.profileCompletion || 0

    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="mb-4">
                <h6 className="text-lg font-semibold text-gray-800 dsark:text-white mb-2">{t('profile.complete-profile')}</h6>
                <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                        {completionPercentage}%
                    </span>
                    <div className="flex-1 bg-green-100 dark:bg-green-900/30 rounded-full h-2">
                        <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-in-out"
                            style={{ width: `${completionPercentage}%` }}
                        >
                        </div>
                    </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Obtenez le meilleur de la réservation en ajoutant les détails restants !
                </p>
            </div>

            <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
                <div className="flex flex-wrap gap-4 justify-between">
                    <Link
                        href="#"
                        className={`flex items-center gap-2 transition-colors ${user?.emailVerified
                            ? 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300'
                            : 'text-gray-400 dark:text-gray-500'
                            }`}
                    >
                        <BsCheckCircleFill className="text-lg" />
                        <span className="font-medium">{t('profile.email-verified')}</span>
                    </Link>
                    <Link
                        href="#"
                        className={`flex items-center gap-2 transition-colors ${user?.mobileVerified
                            ? 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300'
                            : 'text-gray-400 dark:text-gray-500'
                            }`}
                    >
                        <BsCheckCircleFill className="text-lg" />
                        <span className="font-medium">{t('profile.mobile-verified')}</span>
                    </Link>
                    <Link
                        href="#"
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        <BsPlusCircleFill className="text-lg" />
                        <span className="font-medium">{t('profile.complete-basic-info')}</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default ProfileProgress
