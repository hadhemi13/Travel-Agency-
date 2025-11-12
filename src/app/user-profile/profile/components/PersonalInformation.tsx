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
        address: yup.string().optional(),
        datenaissance: yup.string().required('Veuillez entrer votre date de naissance'),
        genre: yup.string().required('Veuillez sélectionner votre genre'),
        nationalite: yup.string().required('Veuillez sélectionner votre nationalité'),
    })

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(informationSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            mobileNo: user?.mobileNo || '',
            address: user?.address || '',
            datenaissance: user?.datenaissance ? (typeof user.datenaissance === 'string' ? user.datenaissance : new Date(user.datenaissance).toISOString().split('T')[0]) : '',
            genre: user?.genre || '',
            nationalite: user?.nationalite || '',
        }
    })

    useEffect(() => {
        if (user && prevUserRef.current !== user.id) {
            prevUserRef.current = user.id
            console.log('🔍 User data received:', user)
            console.log('🔍 datenaissance:', user.datenaissance, typeof user.datenaissance)
            console.log('🔍 genre:', user.genre, typeof user.genre)

            const formData = {
                name: user.name || '',
                email: user.email || '',
                mobileNo: user.mobileNo || '',
                address: user.address || '',
                datenaissance: user.datenaissance ? (typeof user.datenaissance === 'string' ? user.datenaissance : new Date(user.datenaissance).toISOString().split('T')[0]) : '',
                genre: user.genre || '',
                nationalite: user.nationalite || '',
            }
            console.log('🔍 Form data prepared:', formData)
            reset(formData)
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
                datenaissance: data.datenaissance,
                genre: data.genre,
                nationalite: data.nationalite,
                userEmail: user?.email
            })

            if (result.success) {
                setSuccessMessage('Profil mis à jour avec succès !')

                // Update form with new data from database
                if (result.user) {
                    const formData = {
                        name: result.user.name || '',
                        email: result.user.email || '',
                        mobileNo: result.user.mobileNo || '',
                        address: result.user.address || '',
                        datenaissance: result.user.datenaissance ? (typeof result.user.datenaissance === 'string' ? result.user.datenaissance : new Date(result.user.datenaissance).toISOString().split('T')[0]) : '',
                        genre: result.user.genre || '',
                        nationalite: result.user.nationalite || '',
                    }
                    reset(formData)
                }

                setTimeout(() => setSuccessMessage(''), 3000)
            } else {
                if (result.error && result.error.includes('Session temporairement indisponible')) {
                    setSuccessMessage('Session temporairement indisponible. Rechargement automatique...')
                } else {
                    alert(result.error || 'Erreur lors de la mise à jour')
                }
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
        <div className="bg-white dark:bg-[#191b1d] rounded-lg shadow-sm border border-gray-200 dark:border-[rgba(255,255,255,0.07)]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-[rgba(255,255,255,0.07)]">
                <h4 className="text-xl font-semibold text-gray-800 dark:text-white">Personal Information</h4>
            </div>

            {/* Body */}
            <div className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Profile Photo Upload - Booking Style */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative">
                            <Image
                                src={user?.profileImage || '/assets/images/avatar/01.jpg'}
                                alt="Profile"
                                width={80}
                                height={80}
                                className="w-20 h-20 rounded-full border-4 border-white dark:border-[#2a2c31] shadow-lg object-cover"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-[#a1a1a8] mb-2">
                                Upload your profile photo<span className="text-red-500 ml-1">*</span>
                            </label>
                            <label
                                htmlFor="uploadfile-1"
                                className="px-4 py-2 bg-[#8e85e6] hover:bg-[#7a6deb] text-white rounded-lg transition-colors cursor-pointer font-medium"
                            >
                                Change
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

                    {/* Form Fields - Booking Style */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#a1a1a8] mb-2">
                                    Full Name<span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    {...register('name')}
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-[#464950] bg-white dark:bg-[#2a2c31] text-gray-900 dark:text-[#b0b0b8] rounded-lg focus:ring-2 focus:ring-[#8e85e6] focus:border-[#8e85e6] transition-colors"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Mobile Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#a1a1a8] mb-2">
                                    Mobile number<span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    {...register('mobileNo')}
                                    type="tel"
                                    placeholder="Enter your mobile number"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-[#464950] bg-white dark:bg-[#2a2c31] text-gray-900 dark:text-[#b0b0b8] rounded-lg focus:ring-2 focus:ring-[#8e85e6] focus:border-[#8e85e6] transition-colors"
                                />
                                {errors.mobileNo && (
                                    <p className="mt-1 text-sm text-red-600">{errors.mobileNo.message}</p>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#a1a1a8] mb-2">
                                    Date of Birth<span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    type="date"
                                    {...register('datenaissance')}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-[#464950] bg-white dark:bg-[#2a2c31] text-gray-900 dark:text-[#b0b0b8] rounded-lg focus:ring-2 focus:ring-[#8e85e6] focus:border-[#8e85e6] transition-colors"
                                />
                                {errors.datenaissance && (
                                    <p className="text-red-500 text-sm mt-1">{errors.datenaissance.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#a1a1a8] mb-2">
                                    Email address<span className="text-red-500 ml-1">*</span>
                                </label>
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-[#464950] bg-white dark:bg-[#2a2c31] text-gray-900 dark:text-[#b0b0b8] rounded-lg focus:ring-2 focus:ring-[#8e85e6] focus:border-[#8e85e6] transition-colors"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Nationality */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#a1a1a8] mb-2">
                                    Nationality<span className="text-red-500 ml-1">*</span>
                                </label>
                                <select
                                    {...register('nationalite')}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-[#464950] bg-white dark:bg-[#2a2c31] text-gray-900 dark:text-[#b0b0b8] rounded-lg focus:ring-2 focus:ring-[#8e85e6] focus:border-[#8e85e6] transition-colors"
                                >
                                    <option value="">Select your nationality</option>
                                    <option value="France">France</option>
                                    <option value="Belgium">Belgium</option>
                                    <option value="Switzerland">Switzerland</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Morocco">Morocco</option>
                                    <option value="Algeria">Algeria</option>
                                    <option value="Tunisia">Tunisia</option>
                                    <option value="Other">Other</option>
                                </select>
                                {errors.nationalite && (
                                    <p className="text-red-500 text-sm mt-1">{errors.nationalite.message}</p>
                                )}
                            </div>

                            {/* Gender - Radio Buttons */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-[#a1a1a8] mb-3">
                                    Select Gender<span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            {...register('genre')}
                                            type="radio"
                                            value="male"
                                            className="w-4 h-4 text-[#8e85e6] bg-gray-100 dark:bg-[#2a2c31] border-gray-300 dark:border-[#464950] focus:ring-[#8e85e6] focus:ring-2"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-[#a1a1a8]">Male</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            {...register('genre')}
                                            type="radio"
                                            value="female"
                                            className="w-4 h-4 text-[#8e85e6] bg-gray-100 dark:bg-[#2a2c31] border-gray-300 dark:border-[#464950] focus:ring-[#8e85e6] focus:ring-2"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-[#a1a1a8]">Female</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            {...register('genre')}
                                            type="radio"
                                            value="other"
                                            className="w-4 h-4 text-[#8e85e6] bg-gray-100 dark:bg-[#2a2c31] border-gray-300 dark:border-[#464950] focus:ring-[#8e85e6] focus:ring-2"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-[#a1a1a8]">Others</span>
                                    </label>
                                </div>
                                {errors.genre && (
                                    <p className="text-red-500 text-sm mt-1">{errors.genre.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Address Field - Full Width */}
                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#a1a1a8] mb-2">
                            Address
                        </label>
                        <textarea
                            {...register('address')}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-[#464950] bg-white dark:bg-[#2a2c31] text-gray-900 dark:text-[#b0b0b8] rounded-lg focus:ring-2 focus:ring-[#8e85e6] focus:border-[#8e85e6] transition-colors resize-none"
                            placeholder="Enter your address"
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                        )}
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-lg">
                            <p className="text-green-700 dark:text-green-300 text-sm">{successMessage}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-[rgba(255,255,255,0.07)]">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-[#8e85e6] hover:bg-[#7a6deb] disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-[#8e85e6] focus:ring-offset-2 dark:focus:ring-offset-[#191b1d]"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PersonalInformation