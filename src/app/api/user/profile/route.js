import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectToDatabase from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    await connectToDatabase()

    const user = await User.findById(session.user.id).select('-password')
    
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        mobileNo: user.mobileNo,
        address: user.address,
        nationality: user.nationality,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        profileCompletion: user.profileCompletion,
        emailVerified: user.emailVerified,
        mobileVerified: user.mobileVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })

  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { name, mobileNo, address, nationality, dateOfBirth, gender } = body

    await connectToDatabase()

    // Calculate profile completion
    const profileFields = { name, mobileNo, address, nationality, dateOfBirth, gender }
    const completedFields = Object.values(profileFields).filter(value => value && value !== '').length
    const profileCompletion = Math.round((completedFields / Object.keys(profileFields).length) * 100)

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        name,
        mobileNo,
        address,
        nationality,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        profileCompletion,
        updatedAt: new Date()
      },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Profil mis à jour avec succès',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage,
        mobileNo: updatedUser.mobileNo,
        address: updatedUser.address,
        nationality: updatedUser.nationality,
        dateOfBirth: updatedUser.dateOfBirth,
        gender: updatedUser.gender,
        profileCompletion: updatedUser.profileCompletion,
        emailVerified: updatedUser.emailVerified,
        mobileVerified: updatedUser.mobileVerified
      }
    })

  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}
