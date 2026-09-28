'use client'

import { Pill, ShieldCheck, ExternalLink } from 'lucide-react'
import { useDzPharm } from './store'

export function Footer() {
  const setView = useDzPharm((s) => s.setView)

  return (
    <footer className="w-full border-t border-border/80 bg-background/50 py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2.5">
          <div className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Pill className="size-3.5" />
          </div>
          <span className="font-semibold text-foreground">DzPharm Hub</span>
          <span>·</span>
          <span>Nomenclature Officielle &amp; Sécurité Clinique Algérienne</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setView('repertoire')}
            className="hover:text-foreground transition-colors"
          >
            Répertoire 9 555 AMM
          </button>
          <button
            onClick={() => setView('bibliotheque')}
            className="hover:text-foreground transition-colors"
          >
            Monographies RCP
          </button>
          <button
            onClick={() => setView('interactions')}
            className="hover:text-foreground transition-colors"
          >
            Interactions
          </button>
          <button
            onClick={() => setView('securite')}
            className="hover:text-foreground transition-colors"
          >
            Sécurité Clinique
          </button>
          <button
            onClick={() => setView('apropos')}
            className="hover:text-foreground transition-colors"
          >
            Sources &amp; Méthodologie
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/80">
          <ShieldCheck className="size-3.5 text-state-safe" />
          <span>Données vérifiées ANPP / ANSM / CRAT</span>
        </div>
      </div>
    </footer>
  )
}
