import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// Helper function to get current user
async function getCurrentUser() {
  try {
    const session = await getServerSession()
    
    if (session?.user?.id) {
      return await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          id: true,
          nom: true,
          email: true,
          avatarUrl: true
        }
      })
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

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: { 
        avatarUrl: imageUrl,
        updatedAt: new Date()
      },
      select: {
        id: true,
        avatarUrl: true
      }
    })

    return NextResponse.json({
      message: 'Image de profil mise à jour avec succès',
      imageUrl: updatedUser.avatarUrl
    })

  } catch (error) {
    console.error('Error updating profile image:', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}
