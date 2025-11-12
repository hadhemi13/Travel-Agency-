'use client'
import { useState } from 'react'
import { FaTrash, FaMagic } from 'react-icons/fa'
import { TourHistoryType } from '../../data'
import TourCard from './TourCard'
import CustomizeButton from '@/components/CustomizeButton'

interface TourCardWithCustomizeProps {
    tour: TourHistoryType
    onDelete?: (tourId: string) => void
    onCustomize?: (customizedProgramme: any) => void
    onFavoriteChange?: (programmeId: string, isFavorite: boolean) => void
}

const TourCardWithCustomize = ({ tour, onDelete, onCustomize, onFavoriteChange }: TourCardWithCustomizeProps) => {
    const [showActions, setShowActions] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce programme des favoris ?')) return

        const programmeId = tour.originalId || tour.programmeId
        if (!programmeId) {
            alert('❌ Impossible de supprimer : ID du programme manquant')
            return
        }

        try {
            const response = await fetch(`/api/saved-programmes/${programmeId}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Erreur lors de la suppression')
            }

            if (onDelete) {
                onDelete(programmeId)
            }
            alert('✅ Programme supprimé des favoris')
        } catch (err: any) {
            console.error('❌ Erreur suppression:', err)
            alert('❌ Erreur lors de la suppression: ' + err.message)
        }
    }

    return (
        <div className="relative group">
            <TourCard tour={tour} onFavoriteChange={onFavoriteChange} />

            {/* Actions overlay */}
            <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Bouton Personnaliser */}
                <CustomizeButton
                    programmeId={tour.originalId || tour.programmeId || ''}
                    programmeName={tour.name}
                    onCustomize={onCustomize}
                    className="text-xs"
                />

                {/* Bouton Supprimer */}
                <button
                    onClick={handleDelete}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                    title="Supprimer des favoris"
                >
                    <FaTrash size={12} />
                </button>
            </div>
        </div>
    )
}

export default TourCardWithCustomize
