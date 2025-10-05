'use client'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useTranslation } from '@/hooks/useTranslation'

const UpdateEmail = () => {
    const { user } = useUserProfile()
    const { t } = useTranslation()

    const emailSchema = yup.object({
        email: yup
            .string()
            .email(t('form.valid-email'))
            .required(t('form.required-email')),
    })

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(emailSchema),
    })

    const onSubmit = (data: any) => {
        console.log('Email update:', data)
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white">{t('profile.email')}</h4>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {t('profile.enter-email')}{' '}
                    <span className="text-blue-600 dark:text-blue-400 font-medium">{user?.email || t('common.not-defined')}</span>
                </p>
            </div>

            {/* Body */}
            <div className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('form.required-email')}<span className="text-red-500 ml-1">*</span>
                        </label>
                        <input
                            {...register('email')}
                            type="email"
                            placeholder={t('profile.enter-email')}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors font-medium"
                        >
                            {t('form.save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateEmail
