'use client'

import { motion } from 'framer-motion'
import {
  BookOpen,
  Library,
  ShieldAlert,
  ShieldCheck,
  Search,
  Star,
  Clock,
  Sparkles,
  ArrowRight,
  Database,
  FileCheck,
  Stethoscope,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SearchAutocomplete } from './search-autocomplete'
import { useDzPharm } from './store'

export function HomeView() {
  const setView = useDzPharm((s) => s.setView)
  const openDrug = useDzPharm((s) => s.openDrug)
  const favorites = useDzPharm((s) => s.favorites)
  const recentlyViewed = useDzPharm((s) => s.recentlyViewed)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Hero Section */}
      <div className="relative mx-auto max-w-4xl text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary shadow-xs"
        >
          <Sparkles className="size-3.5" />
          <span>Plateforme Officielle de Référence Clinique Algérienne</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          Le médicament, <span className="bg-gradient-to-r from-primary via-sky-500 to-primary bg-clip-text text-transparent">expliqué</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground"
        >
          Nomenclature nationale de 9 555 spécialités AMM, 911 monographies cliniques RCP
          et moteur d&apos;interactions déterministe certifié pour les praticiens algériens.
        </motion.p>

        {/* Hero Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="mx-auto max-w-2xl pt-2"
        >
          <div className="rounded-2xl p-1.5 bg-card/80 border border-primary/30 shadow-xl shadow-primary/10 backdrop-blur-sm">
            <SearchAutocomplete
              placeholder="Rechercher par marque, DCI, laboratoire ou code AMM…"
              onSelect={(drug) => openDrug(drug.id)}
              className="w-full"
            />
          </div>
        </motion.div>

        {/* Fast metric chips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-medium text-muted-foreground"
        >
          <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5">
            <Database className="size-3.5 text-primary" />
            <span><strong className="text-foreground">9 555</strong> Spécialités AMM</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5">
            <FileCheck className="size-3.5 text-state-safe" />
            <span><strong className="text-foreground">911</strong> Monographies RCP</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5">
            <ShieldAlert className="size-3.5 text-state-danger" />
            <span><strong className="text-foreground">54+</strong> Règles Interactions DCI</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5">
            <ShieldCheck className="size-3.5 text-sky-500" />
            <span><strong className="text-foreground">100%</strong> Déterministe &amp; Hors-ligne</span>
          </div>
        </motion.div>
      </div>

      {/* The 3 Core Pillars (Primary Entry Doors) */}
      <div className="mt-14">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Piliers de l&apos;Intelligence Clinique
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Accédez directement aux trois fonctionnalités majeures du référentiel
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Répertoire */}
          <Card
            onClick={() => setView('repertoire')}
            className="group relative cursor-pointer overflow-hidden border-border/80 hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 bg-card/60 backdrop-blur-sm"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-sky-400" />
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                  <BookOpen className="size-6" />
                </div>
                <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30">
                  9 555 Spécialités
                </Badge>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                  <span>Répertoire National AMM</span>
                  <ArrowRight className="size-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Base officielle des médicaments enregistrés en Algérie avec filtrage par forme, dosage, laboratoire, pays et statut réglementaire.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Monographies */}
          <Card
            onClick={() => setView('bibliotheque')}
            className="group relative cursor-pointer overflow-hidden border-border/80 hover:border-state-safe/50 transition-all hover:shadow-xl hover:shadow-state-safe/5 bg-card/60 backdrop-blur-sm"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                  <Library className="size-6" />
                </div>
                <Badge variant="outline" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                  24 Domaines
                </Badge>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                  <span>Monographies &amp; RCPs</span>
                  <ArrowRight className="size-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  911 fiches thérapeutiques standardisées ANSM/ANPP : posologies, mécanismes, contre-indications et conseils comptoir.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Interactions */}
          <Card
            onClick={() => setView('interactions')}
            className="group relative cursor-pointer overflow-hidden border-border/80 hover:border-state-danger/50 transition-all hover:shadow-xl hover:shadow-state-danger/5 bg-card/60 backdrop-blur-sm"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-amber-500" />
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="size-6" />
                </div>
                <Badge variant="outline" className="text-xs font-semibold text-rose-600 dark:text-rose-400 border-rose-500/30">
                  Matrice N×N
                </Badge>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors flex items-center gap-1.5">
                  <span>Moteur d&apos;Interactions</span>
                  <ArrowRight className="size-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  Contrôle instantané de panier de prescriptions, détection d&apos;associations contre-indiquées et matrice thermique de risque.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Favorites & Recently Viewed */}
      {(favorites.length > 0 || recentlyViewed.length > 0) && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Favoris */}
          {favorites.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                <Star className="size-4 text-amber-500 fill-amber-500" />
                <span>Médicaments favoris ({favorites.length})</span>
              </h3>
              <div className="space-y-2">
                {favorites.slice(0, 4).map((fav) => (
                  <button
                    key={fav.id}
                    onClick={() => openDrug(fav.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/50 transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">{fav.brand}</p>
                      <p className="text-xs text-muted-foreground">{fav.dci}</p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Récemment consultés */}
          {recentlyViewed.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                <Clock className="size-4 text-primary" />
                <span>Récemment consultés ({recentlyViewed.length})</span>
              </h3>
              <div className="space-y-2">
                {recentlyViewed.slice(0, 4).map((rec) => (
                  <button
                    key={rec.id}
                    onClick={() => openDrug(rec.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-border/70 bg-card hover:bg-muted/50 transition-colors text-left"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">{rec.brand}</p>
                      <p className="text-xs text-muted-foreground">{rec.dci}</p>
                    </div>
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
