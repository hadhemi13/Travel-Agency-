'use client'
import { useState } from 'react'
import { FaMagic } from 'react-icons/fa'

interface CustomizeButtonProps {
    programmeId: string
    programmeName: string
    onCustomize?: (customizedProgramme: any) => void
    className?: string
}

const CustomizeButton = ({ programmeId, programmeName, onCustomize, className = '' }: CustomizeButtonProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [customPrompt, setCustomPrompt] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleCustomize = async () => {
        if (!customPrompt.trim()) return

        setIsLoading(true)
        try {
            const response = await fetch('/api/saved-programmes/customize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    savedProgrammeId: programmeId,
                    customPrompt: customPrompt.trim()
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la personnalisation')
            }

            // Notifier le parent
            if (onCustomize) {
                onCustomize(data.customizedProgramme)
            }

            // Fermer le modal
            setIsModalOpen(false)
            setCustomPrompt('')

            alert(`✅ Programme personnalisé avec succès !\nTitre: ${data.customizedProgramme.title}\nID: ${data.customizedProgramme.id}`)
        } catch (err: any) {
            console.error('❌ Erreur personnalisation:', err)
            alert('❌ Erreur lors de la personnalisation: ' + err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={`flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors ${className}`}
                title="Personnaliser ce programme avec l'IA"
            >
                <FaMagic size={12} />
                Personnaliser
            </button>

            {/* Modal de personnalisation */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-white mb-4">
                            ✨ Personnaliser le programme
                        </h3>

                        <p className="text-gray-300 mb-4">
                            <strong>{programmeName}</strong>
                        </p>

                        <div className="mb-4">
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                                Décrivez vos modifications :
                            </label>
                            <textarea
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                placeholder="Ex: ajouter une journée de plage, réduire le budget à 700€, inclure plus de restaurants..."
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                rows={4}
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleCustomize}
                                disabled={!customPrompt.trim() || isLoading}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                {isLoading ? 'Personnalisation...' : 'Personnaliser avec l\'IA'}
                            </button>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false)
                                    setCustomPrompt('')
                                }}
                                disabled={isLoading}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white font-semibold rounded-lg transition-colors"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CustomizeButton
