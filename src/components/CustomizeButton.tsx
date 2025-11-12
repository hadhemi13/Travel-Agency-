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

    const defaultPromptTemplate = `Modifier le jour 2 pour :
- Matin : (laisser vide si inchangé)
- Après-midi : (décris ici la nouvelle activité)
- Soir : (laisser vide si inchangé)
- Lieu / détails supplémentaires : ...

⚠️ NE MODIFIE QUE CE JOUR, NE TOUCHE PAS AUX AUTRES JOURS, AU BUDGET OU AUX DATES.`;

    const openModalWithTemplate = () => {
        if (!customPrompt.trim()) {
            setCustomPrompt(defaultPromptTemplate);
        }
        setIsModalOpen(true);
    };

    const handleCustomize = async () => {
        if (!customPrompt.trim()) return

        setIsLoading(true)
        try {
            const response: Response = await fetch('/api/saved-programmes/customize', {
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

            // Rediriger vers la page de détails du nouveau programme personnalisé
            const destination = data.customizedProgramme.destinationName || ''
            const newProgrammeId = data.customizedProgramme.id

            // Construire l'URL avec les paramètres nécessaires
            const url = `/trip-results?destination=${encodeURIComponent(destination)}&programmeId=${newProgrammeId}`

            // Afficher un message de succès et rediriger
            if (confirm(`✅ Programme personnalisé créé avec succès !\n\nVoulez-vous voir les détails du nouveau programme ?`)) {
                window.location.href = url
            }
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
                onClick={openModalWithTemplate}
                className={`flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors ${className}`}
                title="Personnaliser ce programme avec l'IA"
            >
                <FaMagic size={12} />
                Personnaliser
            </button>

            {/* Modal de personnalisation */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent backdrop-blur-sm"
                    onClick={() => {
                        if (isLoading) return
                        setIsModalOpen(false)
                        setCustomPrompt('')
                    }}
                >
                    <div
                        className="w-full max-w-lg rounded-3xl border border-white/15 bg-gradient-to-br from-[#141524]/95 via-[#0f101c]/95 to-[#1a1b2b]/95 p-8 shadow-[0_25px_60px_-25px_rgba(8,9,16,0.9)] ring-1 ring-purple-500/20 backdrop-blur-xl text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
                                <FaMagic size={20} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-white">
                                    Personnaliser le programme
                                </h3>
                                <p className="text-sm text-purple-200/80">
                                    {programmeName}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <label className="block text-sm font-semibold text-purple-100">
                                Décrivez vos modifications
                            </label>
                            <textarea
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                placeholder={`Exemples :
• Modifier le jour 7 pour ajouter une visite de musée
• Changer le programme du jour 3 en journée plage
• Budget à 800€
• Réduire à 5 nuits
• Augmenter le budget à 1200€`}
                                className="w-full rounded-2xl border border-purple-500/40 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-purple-100/60 shadow-inner focus:border-purple-400 focus:outline-none focus:ring-4 focus:ring-purple-500/30 resize-none transition-all"
                                rows={6}
                            />
                            <div className="rounded-2xl border border-dashed border-purple-500/40 bg-purple-500/10 px-4 py-3 text-xs text-purple-100">
                                💡 <strong>Astuce :</strong> Ciblez un jour spécifique (ex: « jour 7 »), ajustez le budget total ou modifiez le nombre de nuits.
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <button
                                onClick={handleCustomize}
                                disabled={!customPrompt.trim() || isLoading}
                                className="flex-1 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:cursor-not-allowed disabled:from-gray-500/60 disabled:to-gray-500/60 disabled:text-gray-300/60 disabled:shadow-none"
                            >
                                {isLoading ? 'Personnalisation...' : 'Personnaliser avec l\'IA'}
                            </button>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false)
                                    setCustomPrompt('')
                                }}
                                disabled={isLoading}
                                className="rounded-2xl border border-white/15 px-5 py-3 text-sm font-semibold text-purple-100 transition-all hover:border-purple-300/40 hover:text-white disabled:cursor-not-allowed disabled:text-purple-200/40"
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
