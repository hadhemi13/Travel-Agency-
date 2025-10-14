import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  try {
    let session
    try {
      session = await getServerSession(authOptions)
    } catch (sessionError) {
      console.error('Session error in GET:', sessionError)
      return NextResponse.json({ 
        message: 'Session temporairement indisponible. Veuillez réessayer.', 
        code: 'SESSION_ERROR' 
      }, { status: 401 })
    }
    
    if (!session?.user?.id) {
      return NextResponse.json({ 
        message: 'Session temporairement indisponible. Veuillez réessayer.', 
        code: 'SESSION_ERROR' 
      }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        nom: true,
        email: true,
        avatarUrl: true,
        telephone: true,
        adresse: true,
        role: true,
        emailVerified: true,
        // mobileVerified: true, // Temporairement commenté car la colonne n'existe pas en DB
        datenaissance: true,
        genre: true,
        nationalite: true,
        createdAt: true,
        updatedAt: true
      }
    })
    
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Calculate profile completion based on filled fields
    const profileFields = [
      user.nom, user.email, user.telephone, 
      user.adresse, user.avatarUrl, user.datenaissance,
      user.genre, user.nationalite 
    ]
    const completedFields = profileFields.filter(field => field && field !== '').length
    const profileCompletion = Math.round((completedFields / profileFields.length) * 100)

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.nom,
        email: user.email,
        profileImage: user.avatarUrl || '/assets/images/avatar/01.jpg',
        mobileNo: user.telephone,
        address: user.adresse,
        prenom: user.prenom,
        role: user.role,
        profileCompletion,
        emailVerified: user.emailVerified,
        // mobileVerified: user.mobileVerified, // Temporairement commenté car la colonne n'existe pas en DB
        
        // Champs de profil étendus
        datenaissance: user.datenaissance,
        genre: user.genre,
        nationalite: user.nationalite,
        
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
    console.log('🔍 PATCH /api/user/profile - Starting...')
    
    let session
    try {
      console.log('🔍 Attempting to get session...')
      session = await getServerSession(authOptions)
      console.log('🔍 Session result:', session ? 'Session found' : 'No session')
      console.log('🔍 Session user ID:', session?.user?.id)
    } catch (sessionError) {
      console.error('❌ Session error:', sessionError)
      return NextResponse.json({ 
        message: 'Session temporairement indisponible. Veuillez réessayer.', 
        code: 'SESSION_ERROR' 
      }, { status: 401 })
    }
    
    if (!session?.user?.id) {
      console.log('❌ No valid session found:', session)
      return NextResponse.json({ 
        message: 'Session temporairement indisponible. Veuillez réessayer.', 
        code: 'SESSION_ERROR' 
      }, { status: 401 })
    }

    console.log('✅ Valid session found, processing request...')

    const body = await request.json()
    const { 
      name, mobileNo, address, datenaissance, genre, 
      nationalite 
    } = body

    // Prepare update data for Prisma
    const updateData = {
      nom: name,
      telephone: mobileNo,
      adresse: address,
      datenaissance: datenaissance ? new Date(datenaissance) : null,
      genre: genre,
      nationalite: nationalite,
      updatedAt: new Date()
    }

    console.log('🔍 Update data prepared:', updateData)

    console.log('🔍 Attempting Prisma update for user ID:', session.user.id)
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        nom: true,
        email: true,
        avatarUrl: true,
        telephone: true,
        adresse: true,
        role: true,
        emailVerified: true,
        // mobileVerified: true, // Temporairement commenté car la colonne n'existe pas en DB
        datenaissance: true,
        genre: true,
        nationalite: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Calculate profile completion
    const profileFields = [
      updatedUser.nom, updatedUser.email, 
      updatedUser.telephone, updatedUser.adresse, updatedUser.avatarUrl,
      updatedUser.datenaissance, updatedUser.genre, updatedUser.nationalite 
    ]
    const completedFields = profileFields.filter(field => field && field !== '').length
    const profileCompletion = Math.round((completedFields / profileFields.length) * 100)

    console.log('✅ Profile updated successfully for user:', session.user.id)

    return NextResponse.json({
      message: 'Profil mis à jour avec succès',
      user: {
        id: updatedUser.id,
        name: updatedUser.nom,
        email: updatedUser.email,
        profileImage: updatedUser.avatarUrl || '/assets/images/avatar/01.jpg',
        mobileNo: updatedUser.telephone,
        address: updatedUser.adresse,
        role: updatedUser.role,
        profileCompletion,
        emailVerified: updatedUser.emailVerified,
        // mobileVerified: updatedUser.mobileVerified, // Temporairement commenté car la colonne n'existe pas en DB
        
        // Champs de profil étendus
        datenaissance: updatedUser.datenaissance,
        genre: updatedUser.genre,
        nationalite: updatedUser.nationalite,
        
       
        
        
        
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt
      }
    })

  } catch (error) {
    console.error('❌ Error updating profile:', error)
    console.error('❌ Error message:', error.message)
    console.error('❌ Error stack:', error.stack)
    
    // Retourner plus de détails pour le debugging
    return NextResponse.json({ 
      message: 'Erreur serveur lors de la mise à jour',
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR'
    }, { status: 500 })
  }
}
   