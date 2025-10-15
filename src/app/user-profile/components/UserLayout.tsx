'use client'
import { useState, useEffect, type ReactNode } from 'react'
import { FaSlidersH } from 'react-icons/fa'
import LeftPanel from './LeftPanel'

const UserLayout = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        document.body.classList.add('dashboard')
        return () => {
            document.body.classList.remove('dashboard')
        }
    })

    return (
        <>
            <main className="pt-16 bg-gray-50 dark:bg-[#222529] min-h-screen">
                <section className="py-6">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Sidebar - Desktop */}
                            <div className="hidden lg:block lg:col-span-3">
                                <LeftPanel />
                            </div>

                            {/* Mobile Menu Button */}
                            <div className="lg:hidden mb-4">
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#8e85e6] text-white rounded-lg hover:bg-[#7a6deb] transition-colors"
                                >
                                    <FaSlidersH />
                                    Menu
                                </button>
                            </div>

                            {/* Main Content */}
                            <div className="lg:col-span-9">
                                {children}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Mobile Offcanvas */}
            {isOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-50"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Sidebar */}
                    <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-[#191b1d] shadow-xl">
                        <div className="p-4 border-b border-gray-200 dark:border-[rgba(255,255,255,0.07)]">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Menu</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2c31] rounded-lg transition-colors"
                                    aria-label="Fermer le menu"
                                    title="Fermer le menu"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <LeftPanel />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default UserLayout
