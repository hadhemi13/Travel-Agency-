import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers'
import connectToDatabase from '@/lib/db'
import User from '@/models/User'

// Helper function to get current user
async function getCurrentUser() {
  try {
    // First try NextAuth session
    const session = await getServerSession()
    
    if (session?.user?.id) {
      await connectToDatabase()
      return await User.findById(session.user.id).select('-password')
    }
    
    if (session?.user?.email) {
      await connectToDatabase()
      return await User.findOne({ email: session.user.email }).select('-password')
    }
    
    // Fallback: try to get from cookies (temporary solution)
    const cookieStore = cookies()
    const userEmail = cookieStore.get('user-email')?.value
    
    if (userEmail) {
      await connectToDatabase()
      return await User.findOne({ email: userEmail }).select('-password')
    }
    
    return null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function POST(request) {
  try {
    const currentUser = await getCurrentUser()
    
    if (!currentUser) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const formData = await request.formData()
    const profileImage = formData.get('profileImage')

    if (!profileImage) {
      return NextResponse.json({ message: 'Aucune image fournie' }, { status: 400 })
    }

    // For now, we'll just store the file name or a placeholder
    // In a real app, you'd upload to a cloud service like AWS S3, Cloudinary, etc.
    const imageUrl = `/assets/images/avatar/${profileImage.name || '01.jpg'}`

    const updatedUser = await User.findByIdAndUpdate(
      currentUser._id,
      { 
        profileImage: imageUrl,
        updatedAt: new Date()
      },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Image de profil mise à jour avec succès',
      profileImage: updatedUser.profileImage
    })

  } catch (error) {
    console.error('Error updating profile image:', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}
