'use client'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

export interface UserProfile {
    id: string
    name: string
    email: string
    profileImage: string
    mobileNo?: string
    address?: string
    nationality?: string
    dateOfBirth?: Date
    gender?: 'male' | 'female' | 'other'
    profileCompletion: number
    emailVerified: boolean
    mobileVerified: boolean
    userEmail?: string // Pour l'identification dans les API routes
}

export const useUserProfile = () => {
    const { data: session, status, update } = useSession()
    const [loading, setLoading] = useState(false)

    // Use session data directly - it already contains all user information from NextAuth
    const user: UserProfile | null = session?.user ? {
        id: (session.user as any).id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        profileImage: (session.user as any).profileImage || '/assets/images/avatar/01.jpg',
        mobileNo: (session.user as any).mobileNo,
        address: (session.user as any).address,
        nationality: (session.user as any).nationality,
        dateOfBirth: (session.user as any).dateOfBirth,
        gender: (session.user as any).gender,
        profileCompletion: (session.user as any).profileCompletion || 0,
        emailVerified: (session.user as any).emailVerified || false,
        mobileVerified: (session.user as any).mobileVerified || false,
    } : null


    const updateProfile = async (profileData: Partial<UserProfile>) => {
        setLoading(true)
        try {
            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            })

            if (response.ok) {
                // Force update the session with fresh data from database
                await update({
                    ...profileData,
                    // Force a refresh by adding a timestamp
                    _refresh: Date.now()
                })
                return { success: true }
            } else {
                const error = await response.json()
                return { success: false, error: error.message }
            }
        } catch (error) {
            console.error('Error updating profile:', error)
            return { success: false, error: 'Une erreur est survenue' }
        } finally {
            setLoading(false)
        }
    }

    const updatePassword = async (currentPassword: string, newPassword: string) => {
        setLoading(true)
        try {
            const response = await fetch('/api/user/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            })

            if (response.ok) {
                return { success: true }
            } else {
                const error = await response.json()
                return { success: false, error: error.message }
            }
        } catch (error) {
            console.error('Error updating password:', error)
            return { success: false, error: 'Une erreur est survenue' }
        } finally {
            setLoading(false)
        }
    }

    const uploadProfileImage = async (file: File) => {
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append('profileImage', file)

            const response = await fetch('/api/user/profile-image', {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                const result = await response.json()
                await update()
                return { success: true, imageUrl: result.imageUrl }
            } else {
                const error = await response.json()
                return { success: false, error: error.message }
            }
        } catch (error) {
            console.error('Error uploading image:', error)
            return { success: false, error: 'Une erreur est survenue' }
        } finally {
            setLoading(false)
        }
    }

    return {
        user,
        loading,
        status,
        updateProfile,
        updatePassword,
        uploadProfileImage,
    }
}
