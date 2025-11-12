'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

const FavoritesDebug = () => {
    const { data: session, status } = useSession()
    const [testResult, setTestResult] = useState(null)
    const [loading, setLoading] = useState(false)

    const testAPI = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/test-favorites')
            const data = await response.json()
            setTestResult(data)
        } catch (error) {
            setTestResult({ error: error.message })
        } finally {
            setLoading(false)
        }
    }

    const testFavoritesAPI = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/favorites')
            const data = await response.json()
            setTestResult({ favoritesAPI: data })
        } catch (error) {
            setTestResult({ favoritesAPIError: error.message })
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading') {
        return <div>Chargement de la session...</div>
    }

    if (status === 'unauthenticated') {
        return <div>Non connecté</div>
    }

    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-bold mb-4">🔧 Debug API Favoris</h3>

            <div className="mb-4">
                <p><strong>Utilisateur:</strong> {session?.user?.email}</p>
                <p><strong>ID:</strong> {session?.user?.id}</p>
            </div>

            <div className="space-x-2 mb-4">
                <button
                    onClick={testAPI}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Test...' : 'Test API Simple'}
                </button>

                <button
                    onClick={testFavoritesAPI}
                    disabled={loading}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                >
                    {loading ? 'Test...' : 'Test API Favoris'}
                </button>
            </div>

            {testResult && (
                <div className="mt-4">
                    <h4 className="font-bold mb-2">Résultat:</h4>
                    <pre className="bg-gray-200 p-2 rounded text-sm overflow-auto">
                        {JSON.stringify(testResult, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    )
}

export default FavoritesDebug
