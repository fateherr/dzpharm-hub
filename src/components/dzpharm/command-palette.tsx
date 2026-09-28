'use client'

import React, { useEffect, useState, useTransition } from 'react'
import {
  BookOpen,
  BookText,
  Clock,
  Compass,
  CornerDownLeft,
  Droplets,
  HeartPulse,
  History,
  Home,
  Info,
  Library,
  Loader2,
  Pill,
  Search,
  ShieldAlert,
  ShieldCheck,
  Stethoscope,
  Trash2,
} from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { GLOSSARY_TERMS } from '@/lib/glossary-data'
import { useDzPharm, type ViewId } from './store'
import type { Drug } from './types'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface MonographSearchResult {
  dciKey: string
  title: string
  domain: string
  subdomain?: string
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const setView = useDzPharm((s) => s.setView)
  const openDrug = useDzPharm((s) => s.openDrug)
  const openLibraryMonograph = useDzPharm((s) => s.openLibraryMonograph)
  const setSafetyTab = useDzPharm((s) => s.setSafetyTab)

  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query.trim(), 280)
  const [isPending, startTransition] = useTransition()

  const [drugResults, setDrugResults] = useState<Drug[]>([])
  const [monoResults, setMonoResults] = useState<MonographSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentQueries, setRecentQueries] = useState<string[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dzpharm_hub_recent_searches')
      if (saved) setRecentQueries(JSON.parse(saved))
    } catch {}
  }, [])

  const saveRecentQuery = (term: string) => {
    if (!term || term.length < 2) return
    const updated = [term, ...recentQueries.filter((q) => q.toLowerCase() !== term.toLowerCase())].slice(0, 5)
    setRecentQueries(updated)
    try {
      localStorage.setItem('dzpharm_hub_recent_searches', JSON.stringify(updated))
    } catch {}
  }

  const clearRecentQueries = () => {
    setRecentQueries([])
    try {
      localStorage.removeItem('dzpharm_hub_recent_searches')
    } catch {}
  }

  // Effectuer les recherches distantes
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setDrugResults([])
      setMonoResults([])
      setIsLoading(false)
      return
    }

    const controller = new AbortController()
    setIsLoading(true)

    async function search() {
      try {
        const [drugRes, monoRes] = await Promise.all([
          fetch(`/api/drugs?q=${encodeURIComponent(debouncedQuery)}&limit=6`, {
            signal: controller.signal,
          }).then((r) => (r.ok ? r.json() : { drugs: [] })),
          fetch(`/api/monographs?q=${encodeURIComponent(debouncedQuery)}&limit=4`, {
            signal: controller.signal,
          }).then((r) => (r.ok ? r.json() : { monographs: [] })),
        ])

        startTransition(() => {
          setDrugResults(drugRes.drugs || [])
          setMonoResults(monoRes.monographs || [])
          setIsLoading(false)
        })
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          setIsLoading(false)
        }
      }
    }

    search()

    return () => controller.abort()
  }, [debouncedQuery])

  // Résultats glossaire locaux
  const glossaryResults = query.trim().length >= 2
    ? GLOSSARY_TERMS.filter(
        (g) =>
          g.term.toLowerCase().includes(query.toLowerCase()) ||
          g.definition.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : []

  const handleSelectNav = (v: ViewId) => {
    setView(v)
    onOpenChange(false)
    setQuery('')
  }

  const handleSelectDrug = (id: number, brand: string) => {
    saveRecentQuery(brand)
    openDrug(id)
    onOpenChange(false)
    setQuery('')
  }

  const handleSelectMonograph = (dciKey: string, title: string) => {
    saveRecentQuery(title)
    openLibraryMonograph(dciKey)
    onOpenChange(false)
    setQuery('')
  }

  const handleSelectSafety = (tab: string) => {
    setSafetyTab(tab)
    onOpenChange(false)
    setQuery('')
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Rechercher médicament, DCI, monographie, sécurité..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-[380px] scroll-thin">
        {isLoading && (
          <div className="flex items-center justify-center p-4 text-xs text-muted-foreground gap-2">
            <Loader2 className="size-3.5 animate-spin text-primary" />
            <span>Recherche dans la nomenclature officielle…</span>
          </div>
        )}

        {!query && recentQueries.length > 0 && (
          <CommandGroup
            heading={
              <div className="flex items-center justify-between">
                <span>Recherches récentes</span>
                <button
                  onClick={clearRecentQueries}
                  className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <Trash2 className="size-3" />
                  Effacer
                </button>
              </div>
            }
          >
            {recentQueries.map((term) => (
              <CommandItem
                key={term}
                onSelect={() => setQuery(term)}
                className="gap-2.5 text-xs py-2 cursor-pointer"
              >
                <History className="size-3.5 text-muted-foreground" />
                <span>{term}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Navigation Rapide */}
        {!query && (
          <CommandGroup heading="Navigation Référentiel">
            <CommandItem onSelect={() => handleSelectNav('repertoire')} className="gap-2.5 text-xs py-2">
              <BookOpen className="size-4 text-primary" />
              <span>Répertoire National (9 555 Spécialités AMM)</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelectNav('bibliotheque')} className="gap-2.5 text-xs py-2">
              <Library className="size-4 text-emerald-500" />
              <span>Bibliothèque Clinique (911 Monographies RCP)</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelectNav('interactions')} className="gap-2.5 text-xs py-2">
              <ShieldAlert className="size-4 text-rose-500" />
              <span>Moteur d&apos;Interactions Médicamenteuses</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelectNav('securite')} className="gap-2.5 text-xs py-2">
              <ShieldCheck className="size-4 text-sky-500" />
              <span>Sécurité Thérapeutique &amp; Validation</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelectNav('apropos')} className="gap-2.5 text-xs py-2">
              <Info className="size-4 text-muted-foreground" />
              <span>Sources &amp; Méthodologie ANPP/ANSM</span>
            </CommandItem>
          </CommandGroup>
        )}

        {/* Outils Cliniques de Sécurité */}
        {query.length > 0 && (
          <CommandGroup heading="Outils de Sécurité Clinique">
            <CommandItem onSelect={() => handleSelectSafety('ordonnance')} className="gap-2.5 text-xs py-2">
              <Stethoscope className="size-4 text-primary" />
              <span>Vérification d&apos;ordonnance complète</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelectSafety('grossesse')} className="gap-2.5 text-xs py-2">
              <HeartPulse className="size-4 text-rose-500" />
              <span>Grossesse &amp; Allaitement (Référentiel CRAT)</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelectSafety('renal')} className="gap-2.5 text-xs py-2">
              <Droplets className="size-4 text-sky-500" />
              <span>Calculateur de clairance rénale (Cockcroft-Gault / MDRD)</span>
            </CommandItem>
          </CommandGroup>
        )}

        {/* Résultats Médicaments */}
        {drugResults.length > 0 && (
          <CommandGroup heading={`Spécialités AMM (${drugResults.length})`}>
            {drugResults.map((drug) => (
              <CommandItem
                key={drug.id}
                onSelect={() => handleSelectDrug(drug.id, drug.brand)}
                className="gap-2.5 text-xs py-2 cursor-pointer"
              >
                <Pill className="size-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground truncate">{drug.brand}</span>
                    {drug.dosage && <span className="text-[11px] text-muted-foreground">{drug.dosage}</span>}
                    {drug.form && <Badge variant="outline" className="text-[9px] px-1 py-0">{drug.form}</Badge>}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{drug.dci}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Résultats Monographies */}
        {monoResults.length > 0 && (
          <CommandGroup heading={`Monographies Cliniques (${monoResults.length})`}>
            {monoResults.map((mono) => (
              <CommandItem
                key={mono.dciKey}
                onSelect={() => handleSelectMonograph(mono.dciKey, mono.title)}
                className="gap-2.5 text-xs py-2 cursor-pointer"
              >
                <BookText className="size-4 text-emerald-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-foreground truncate">{mono.title}</span>
                  <p className="text-[10px] text-muted-foreground truncate">{mono.domain}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Résultats Glossaire */}
        {glossaryResults.length > 0 && (
          <CommandGroup heading="Glossaire Médical">
            {glossaryResults.map((item) => (
              <CommandItem
                key={item.term}
                onSelect={() => handleSelectNav('bibliotheque')}
                className="gap-2.5 text-xs py-2 cursor-pointer"
              >
                <Compass className="size-4 text-amber-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-foreground">{item.term}</span>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{item.definition}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {query.length >= 2 && !isLoading && drugResults.length === 0 && monoResults.length === 0 && glossaryResults.length === 0 && (
          <CommandEmpty className="p-6 text-center text-xs text-muted-foreground">
            Aucun médicament ou monographie ne correspond à &ldquo;{query}&rdquo;.
          </CommandEmpty>
        )}
      </CommandList>
    </CommandDialog>
  )
}
