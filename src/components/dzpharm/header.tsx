'use client'

import { useTheme } from 'next-themes'
import {
  BookOpen,
  Home,
  Library,
  Moon,
  Palette,
  Pill,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sun,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDzPharm, type ViewId } from './store'
import { PaletteDialog } from './palette-dialog'

interface NavItem {
  id: ViewId
  label: string
  icon: typeof Home
}

const NAV_ITEMS: NavItem[] = [
  { id: 'accueil', label: 'Accueil', icon: Home },
  { id: 'repertoire', label: 'Répertoire AMM', icon: BookOpen },
  { id: 'bibliotheque', label: 'Monographies RCP', icon: Library },
  { id: 'interactions', label: 'Interactions', icon: ShieldAlert },
  { id: 'securite', label: 'Sécurité Clinique', icon: ShieldCheck },
  { id: 'apropos', label: 'À propos', icon: Info },
]

export function Header({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const view = useDzPharm((s) => s.view)
  const setView = useDzPharm((s) => s.setView)
  const basket = useDzPharm((s) => s.basket)
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <button
          onClick={() => setView('accueil')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg transition-transform active:scale-95"
        >
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25">
            <Pill className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-foreground">
                Dz<span className="text-primary">Pharm</span>
              </span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-bold border-primary/30 text-primary">
                HUB
              </Badge>
            </div>
            <p className="text-[10px] font-medium text-muted-foreground leading-none">
              Nomenclature &amp; Sécurité Clinique
            </p>
          </div>
        </button>

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = view === item.id
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={cn(
                  'relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors',
                  isActive
                    ? 'text-primary bg-primary/10 shadow-xs'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
                {item.id === 'interactions' && basket.length > 0 && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-state-danger text-[9px] font-bold text-white">
                    {basket.length}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Search Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSearch}
            className="h-9 gap-2 px-3 rounded-lg text-xs text-muted-foreground hover:text-foreground border-border/80"
          >
            <Search className="size-3.5" />
            <span className="hidden sm:inline">Rechercher</span>
            <kbd className="hidden sm:inline-block rounded border border-border bg-muted px-1.5 text-[10px] font-mono text-muted-foreground">
              ⌘K
            </kbd>
          </Button>

          {/* Nuancier */}
          <PaletteDialog />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="size-9 rounded-lg"
            aria-label="Basculer le thème"
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="size-4 text-amber-400" />
            ) : (
              <Moon className="size-4 text-muted-foreground" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden border-t border-border/60 overflow-x-auto px-2 py-1.5 scroll-thin gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = view === item.id
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="size-3.5" />
              <span>{item.label}</span>
              {item.id === 'interactions' && basket.length > 0 && (
                <span className="flex size-3.5 items-center justify-center rounded-full bg-state-danger text-[8px] font-bold text-white">
                  {basket.length}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </header>
  )
}
