'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Header } from '@/components/dzpharm/header'
import { Footer } from '@/components/dzpharm/footer'
import { HomeView } from '@/components/dzpharm/home-view'
import { DirectoryView } from '@/components/dzpharm/directory-view'
import { LibraryView } from '@/components/dzpharm/library-view'
import { InteractionsView } from '@/components/dzpharm/interactions-view'
import { SafetyView } from '@/components/dzpharm/safety-view'
import { AboutView } from '@/components/dzpharm/about-view'
import { DrugSheet } from '@/components/dzpharm/drug-sheet'
import { CommandPalette } from '@/components/dzpharm/command-palette'
import { useDzPharm } from '@/components/dzpharm/store'

export default function Page() {
  const view = useDzPharm((s) => s.view)
  const [searchOpen, setSearchOpen] = useState(false)

  // Global Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header onOpenSearch={() => setSearchOpen(true)} />

      <main id="contenu" className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {view === 'accueil' && <HomeView />}
            {view === 'repertoire' && <DirectoryView />}
            {view === 'bibliotheque' && <LibraryView />}
            {view === 'interactions' && <InteractionsView />}
            {view === 'securite' && <SafetyView />}
            {view === 'apropos' && <AboutView />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

      {/* Global Modals */}
      <DrugSheet />
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  )
}
