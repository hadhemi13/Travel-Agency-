'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useTranslation } from '@/hooks/useTranslation'

const UpdatePassword = () => {
    const { user, updatePassword } = useUserProfile()
    const { t } = useTranslation()
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const updatePasswordSchema = yup.object({
        currentPassword: yup
            .string()
            .required(t('form.required') + ' votre mot de passe actuel'),
        newPassword: yup
            .string()
            .required(t('form.required') + ' votre nouveau mot de passe')
            .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
        confirmPassword: yup
            .string()
            .oneOf([yup.ref('newPassword')], 'Les mots de passe ne correspondent pas')
            .required(t('form.required') + ' confirmer votre nouveau mot de passe'),
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(updatePasswordSchema),
    })

    const onSubmit = async (data: any) => {
        setIsSubmitting(true)
        setSuccessMessage('')
        setErrorMessage('')

        try {
            const result = await updatePassword(data.currentPassword, data.newPassword)

            if (result.success) {
                setSuccessMessage('Mot de passe mis à jour avec succès !')
                setTimeout(() => setSuccessMessage(''), 3000)
                // Reset form
                reset()
            } else {
                setErrorMessage(result.error || 'Erreur lors de la mise à jour du mot de passe')
            }
        } catch (error) {
            setErrorMessage('Erreur lors de la mise à jour du mot de passe')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-white dark:bg-[#191b1d] rounded-lg shadow-sm border border-gray-200 dark:border-[rgba(255,255,255,0.07)]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-[rgba(255,255,255,0.07)]">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white">{t('profile.password')}</h4>
                <p className="text-gray-600 dark:text-[#a1a1a8] mt-1">
                    {t('profile.enter-email')}{' '}
                    <span className="text-[#8e85e6] dark:text-[#8e85e6] font-medium">{user?.email || t('common.not-defined')}</span>
                </p>
            </div>

            {/* Body */}
            <div className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#a1a1a8] mb-2">
                            {t('form.required')} votre mot de passe actuel
                        </label>
                        <div className="relative">
                            <input
                                {...register('currentPassword')}
                                type={showCurrentPassword ? 'text' : 'password'}
                                placeholder={t('form.required') + ' votre mot de passe actuel'}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-[#464950] bg-white dark:bg-[#2a2c31] text-gray-900 dark:text-[#b0b0b8] rounded-lg focus:ring-2 focus:ring-[#8e85e6] focus:border-[#8e85e6] transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showCurrentPassword ? <BsEyeSlash /> : <BsEye />}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
                        )}
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#a1a1a8] mb-2">
                            {t('form.required')} votre nouveau mot de passe
                        </label>
                        <div className="relative">
                            <input
                                {...register('newPassword')}
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder={t('form.required') + ' votre nouveau mot de passe'}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-[#464950] bg-white dark:bg-[#2a2c31] text-gray-900 dark:text-[#b0b0b8] rounded-lg focus:ring-2 focus:ring-[#8e85e6] focus:border-[#8e85e6] transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showNewPassword ? <BsEyeSlash /> : <BsEye />}
                            </button>
                        </div>
                        {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#a1a1a8] mb-2">
                            {t('form.required')} confirmer votre nouveau mot de passe
                        </label>
                        <div className="relative">
                            <input
                                {...register('confirmPassword')}
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder={t('form.required') + ' confirmer votre nouveau mot de passe'}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-[#464950] bg-white dark:bg-[#2a2c31] text-gray-900 dark:text-[#b0b0b8] rounded-lg focus:ring-2 focus:ring-[#8e85e6] focus:border-[#8e85e6] transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
                            <p className="text-green-700 dark:text-green-300 text-sm">{successMessage}</p>
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
                            <p className="text-red-700 dark:text-red-300 text-sm">{errorMessage}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-[#8e85e6] hover:bg-[#7a6deb] disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-[#8e85e6] focus:ring-offset-2 dark:focus:ring-offset-[#191b1d] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? t('profile.saving') : t('form.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdatePassword
