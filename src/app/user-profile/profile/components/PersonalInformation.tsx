'use client'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useTranslation } from '@/hooks/useTranslation'

const PersonalInformation = () => {
    const { user, updateProfile, uploadProfileImage } = useUserProfile()
    const { t } = useTranslation()
    const [selectedGender, setSelectedGender] = useState('male')
    const [selectedCountry, setSelectedCountry] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const prevUserRef = useRef<string | null>(null)


    const informationSchema = yup.object({
        name: yup.string().required('Veuillez entrer votre nom complet'),
        email: yup
            .string()
            .email('Veuillez entrer un email valide')
            .required('Veuillez entrer votre email'),
        mobileNo: yup.string().required('Veuillez entrer votre numéro de mobile'),
        address: yup.string().required('Veuillez entrer votre adresse'),
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(informationSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            mobileNo: user?.mobileNo || '',
            address: user?.address || '',
        },
    })

    // Update form when user data changes
    useEffect(() => {
        if (user && user.id !== prevUserRef.current) {
            const formData = {
                name: user.name || '',
                email: user.email || '',
                mobileNo: user.mobileNo || '',
                address: user.address || '',
            }

            reset(formData)
            setSelectedGender(user.gender || 'male')
            setSelectedCountry(user.nationality || '')
            prevUserRef.current = user.id
        }
    }, [user, reset])

    const onSubmit = async (data: any) => {
        setIsSubmitting(true)
        setSuccessMessage('')

        try {
            const result = await updateProfile({
                name: data.name,
                mobileNo: data.mobileNo,
                address: data.address,
                nationality: selectedCountry,
                gender: selectedGender as 'male' | 'female' | 'other',
                userEmail: user?.email // Passer l'email pour identifier l'utilisateur
            })

            if (result.success) {
                setSuccessMessage('Profil mis à jour avec succès !')
                setTimeout(() => setSuccessMessage(''), 3000)
            } else {
                alert(result.error || 'Erreur lors de la mise à jour')
            }
        } catch (error) {
            alert('Erreur lors de la mise à jour du profil')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const result = await uploadProfileImage(file)
            if (result.success) {
                setSuccessMessage('Photo de profil mise à jour !')
                setTimeout(() => setSuccessMessage(''), 3000)
            } else {
                alert(result.error || 'Erreur lors du téléchargement de l\'image')
            }
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white">{t('profile.personal-info')}</h4>
            </div>

            {/* Body */}
            <div className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Profile Photo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('profile.upload-photo')}<span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Image
                                    src={user?.profileImage || '/assets/images/avatar/01.jpg'}
                                    alt="Profile"
                                    width={80}
                                    height={80}
                                    className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                            </div>
                            <label
                                htmlFor="uploadfile-1"
                                className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer font-medium"
                            >
                                {t('profile.change')}
                            </label>
                            <input
                                id="uploadfile-1"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('form.name')}<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                {...register('name')}
                                type="text"
                                placeholder={t('profile.enter-name')}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('form.email')}<span className="text-red-500 ml-1">*</span>
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

                        {/* Mobile Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('form.mobile')}<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                {...register('mobileNo')}
                                type="tel"
                                placeholder={t('profile.enter-mobile')}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                            {errors.mobileNo && (
                                <p className="mt-1 text-sm text-red-600">{errors.mobileNo.message}</p>
                            )}
                        </div>

                        {/* Nationality */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('form.nationality')}<span className="text-red-500 ml-1">*</span>
                            </label>
                            <select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                aria-label="Sélectionnez votre pays"
                                title="Sélectionnez votre pays"
                            >
                                <option value="">{t('profile.select-country')}</option>
                                <option value="USA">USA</option>
                                <option value="France">France</option>
                                <option value="India">Inde</option>
                                <option value="UK">Royaume-Uni</option>
                            </select>
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('form.date-of-birth')}<span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="date"
                                defaultValue={user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : ""}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                aria-label="Date de naissance"
                                title="Date de naissance"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('profile.select-gender')}<span className="text-red-500 ml-1">*</span>
                            </label>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={selectedGender === 'male'}
                                        onChange={(e) => setSelectedGender(e.target.value)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">{t('form.male')}</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={selectedGender === 'female'}
                                        onChange={(e) => setSelectedGender(e.target.value)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">{t('form.female')}</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="other"
                                        checked={selectedGender === 'other'}
                                        onChange={(e) => setSelectedGender(e.target.value)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">{t('form.other')}</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('form.address')}
                        </label>
                        <textarea
                            {...register('address')}
                            rows={3}
                            placeholder={t('profile.enter-address')}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        />
                        {errors.address && (
                            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                        )}
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg">
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
                            {isSubmitting ? t('profile.saving') : t('profile.save-changes')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PersonalInformation
