import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectToDatabase from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Mot de passe actuel et nouveau mot de passe requis' }, { status: 400 })
    }

    await connectToDatabase()

    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Mot de passe actuel incorrect' }, { status: 400 })
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await User.findByIdAndUpdate(
      session.user.id,
      {
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    )

    return NextResponse.json({ message: 'Mot de passe mis à jour avec succès' })

  } catch (error) {
    console.error('Error updating password:', error)
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
  }
}
