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

        try {
            const result = await updatePassword(data.currentPassword, data.newPassword)

            if (result.success) {
                setSuccessMessage('Mot de passe mis à jour avec succès !')
                setTimeout(() => setSuccessMessage(''), 3000)
                // Reset form
                reset()
            } else {
                alert(result.error || 'Erreur lors de la mise à jour du mot de passe')
            }
        } catch (error) {
            alert('Erreur lors de la mise à jour du mot de passe')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white">{t('profile.password')}</h4>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {t('profile.enter-email')}{' '}
                    <span className="text-blue-600 dark:text-blue-400 font-medium">{user?.email || t('common.not-defined')}</span>
                </p>
            </div>

            {/* Body */}
            <div className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('form.required')} votre mot de passe actuel
                        </label>
                        <div className="relative">
                            <input
                                {...register('currentPassword')}
                                type={showCurrentPassword ? 'text' : 'password'}
                                placeholder={t('form.required') + ' votre mot de passe actuel'}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('form.required')} votre nouveau mot de passe
                        </label>
                        <div className="relative">
                            <input
                                {...register('newPassword')}
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder={t('form.required') + ' votre nouveau mot de passe'}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('form.required')} confirmer votre nouveau mot de passe
                        </label>
                        <div className="relative">
                            <input
                                {...register('confirmPassword')}
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder={t('form.required') + ' confirmer votre nouveau mot de passe'}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-4">
                            {successMessage}
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
