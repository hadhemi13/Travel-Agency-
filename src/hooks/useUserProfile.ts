'use client'
import { useSession, getSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

export interface UserProfile {
    id: string
    name: string
    email: string
    profileImage: string
    mobileNo?: string
    address?: string
    role?: string
    profileCompletion: number
    emailVerified: boolean
    mobileVerified: boolean

    // Champs de profil étendus
    datenaissance?: Date
    genre?: 'male' | 'female' | 'other'
    nationalite?: string

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
        mobileNo: (session.user as any).telephone,
        address: (session.user as any).adresse,
        role: (session.user as any).role,
        profileCompletion: (session.user as any).profileCompletion || 0,
        emailVerified: (session.user as any).emailVerified || false,
        mobileVerified: (session.user as any).mobileVerified || false,

        // Champs de profil étendus
        datenaissance: (session.user as any).datenaissance,
        genre: (session.user as any).genre,
        nationalite: (session.user as any).nationalite,
    } : null

    // Debug logs
    if (session?.user) {
        console.log('🔍 Session user data:', session.user)
        console.log('🔍 datenaissance from session:', (session.user as any).datenaissance, typeof (session.user as any).datenaissance)
        console.log('🔍 genre from session:', (session.user as any).genre, typeof (session.user as any).genre)
        console.log('🔍 nationalite from session:', (session.user as any).nationalite, typeof (session.user as any).nationalite)
    }


    const updateProfile = async (profileData: Partial<UserProfile>) => {
        setLoading(true)
        try {
            console.log('🔍 Sending profile data:', profileData)
            console.log('🔍 datenaissance being sent:', profileData.datenaissance, typeof profileData.datenaissance)

            const response = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            })

            if (response.ok) {
                const result = await response.json()
                console.log('🔍 Received result from API:', result)
                console.log('🔍 datenaissance from API:', result.user?.datenaissance, typeof result.user?.datenaissance)

                // Update the session with the fresh data from the database
                await update({
                    name: result.user.name,
                    email: result.user.email,
                    profileImage: result.user.profileImage,
                    telephone: result.user.mobileNo,
                    adresse: result.user.address,
                    role: result.user.role,
                    profileCompletion: result.user.profileCompletion,
                    emailVerified: result.user.emailVerified,
                    mobileVerified: result.user.mobileVerified,
                    datenaissance: result.user.datenaissance,
                    genre: result.user.genre,
                    nationalite: result.user.nationalite,
                    // Force a refresh by adding a timestamp
                    _refresh: Date.now()
                })

                // Force a session refresh by calling getSession
                await getSession()
                return { success: true, user: result.user }
            } else {
                const error = await response.json()

                // Si erreur de session, essayer de recharger la session
                if (error.code === 'INVALID_SESSION' || error.code === 'SESSION_ERROR') {
                    console.log('Session temporairement indisponible, tentative de rechargement...')
                    // Recharger la page pour réinitialiser la session sans déconnexion
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                    return { success: false, error: 'Session temporairement indisponible. Rechargement...' }
                }

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
