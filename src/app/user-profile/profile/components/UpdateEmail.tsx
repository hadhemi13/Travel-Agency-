'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useTranslation } from '@/hooks/useTranslation'

const UpdateEmail = () => {
    const { user, updateProfile } = useUserProfile()
    const { t } = useTranslation()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const emailSchema = yup.object({
        email: yup
            .string()
            .email('Veuillez entrer un email valide')
            .required('Veuillez entrer votre email'),
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(emailSchema),
        defaultValues: {
            email: user?.email || ''
        }
    })

    // Update form when user data changes
    useEffect(() => {
        if (user?.email) {
            reset({ email: user.email })
        }
    }, [user?.email, reset])

    const onSubmit = async (data: any) => {
        setIsSubmitting(true)
        setSuccessMessage('')
        setErrorMessage('')

        try {
            const result = await updateProfile({
                email: data.email,
                userEmail: user?.email
            })

            if (result.success) {
                setSuccessMessage('Email mis à jour avec succès !')
                setTimeout(() => setSuccessMessage(''), 3000)
            } else {
                setErrorMessage(result.error || 'Erreur lors de la mise à jour de l\'email')
            }
        } catch (error) {
            setErrorMessage('Erreur lors de la mise à jour de l\'email')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="bg-white dark:bg-[#191b1d] rounded-lg shadow-sm border border-gray-200 dark:border-[rgba(255,255,255,0.07)]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-[rgba(255,255,255,0.07)]">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white">{t('profile.email')}</h4>
                <p className="text-gray-600 dark:text-[#a1a1a8] mt-1">
                    {t('profile.enter-email')}{' '}
                    <span className="text-[#8e85e6] dark:text-[#8e85e6] font-medium">{user?.email || t('common.not-defined')}</span>
                </p>
            </div>

            {/* Body */}
            <div className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#a1a1a8] mb-2">
                            Nouvel email<span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            {...register('email')}
                            type="email"
                            placeholder="Entrez votre nouvel email"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-[#464950] bg-white dark:bg-[#2a2c31] text-gray-900 dark:text-[#b0b0b8] rounded-lg focus:ring-2 focus:ring-[#8e85e6] focus:border-[#8e85e6] transition-colors"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
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

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-[#8e85e6] hover:bg-[#7a6deb] disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium focus:ring-2 focus:ring-[#8e85e6] focus:ring-offset-2 dark:focus:ring-offset-[#191b1d] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateEmail
