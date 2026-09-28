import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DesignMode, PaletteId } from './types'

export type ViewId =
  | 'accueil'
  | 'repertoire'
  | 'bibliotheque'
  | 'interactions'
  | 'securite'
  | 'apropos'

export interface DirectoryFilters {
  q: string
  status: string
  domain: string
  form: string
  liste: string
  country: string
  lab: string
}

export const EMPTY_FILTERS: DirectoryFilters = {
  q: '',
  status: '',
  domain: '',
  form: '',
  liste: '',
  country: '',
  lab: '',
}

export interface BasketItem {
  id: number
  brand: string
  dci: string
  status: string
}

export interface FavoriteItem {
  id: number
  brand: string
  dci: string
  addedAt: number
}

export interface RecentItem {
  id: number
  brand: string
  dci: string
  status: string
  viewedAt: number
}

export type AddResult = 'added' | 'duplicate' | 'full'
export type DensityMode = 'compact' | 'standard' | 'spacious'

export const MAX_BASKET = 10
export const MAX_FAVORITES = 30
export const MAX_RECENT = 8

interface DzPharmState {
  // Navigation
  view: ViewId
  setView: (v: ViewId) => void

  // Thème & Nuancier
  designMode: DesignMode
  setDesignMode: (m: DesignMode) => void
  palette: PaletteId
  setPalette: (p: PaletteId) => void
  density: DensityMode
  setDensity: (d: DensityMode) => void

  // Fiche médicament (sliding sheet)
  activeDrugId: number | null
  isDrugSheetOpen: boolean
  openDrug: (id: number) => void
  closeDrug: () => void

  // Navigation vers la bibliothèque (Monographie ciblée)
  libraryDciKey: string | null
  openLibraryMonograph: (dciKey: string) => void
  clearLibraryDciKey: () => void

  // Navigation vers les outils de sécurité
  safetyTab: string | null
  setSafetyTab: (tab: string) => void
  clearSafetyTab: () => void

  // Filtres du répertoire
  filters: DirectoryFilters
  setFilter: <K extends keyof DirectoryFilters>(k: K, v: DirectoryFilters[K]) => void
  setFilters: (f: Partial<DirectoryFilters>) => void
  resetFilters: () => void

  // Panier d'interactions
  basket: BasketItem[]
  addToBasket: (item: BasketItem) => AddResult
  removeFromBasket: (id: number) => void
  clearBasket: () => void

  // Favoris
  favorites: FavoriteItem[]
  toggleFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => void
  isFavorite: (id: number) => boolean

  // Historique récent
  recentlyViewed: RecentItem[]
  addRecentlyViewed: (item: Omit<RecentItem, 'viewedAt'>) => void
}

export const useDzPharm = create<DzPharmState>()(
  persist(
    (set, get) => ({
      view: 'accueil',
      setView: (view) => set({ view }),

      designMode: 'standard',
      setDesignMode: (designMode) => set({ designMode }),
      palette: 'porcelain',
      setPalette: (palette) => set({ palette }),
      density: 'standard',
      setDensity: (density) => set({ density }),

      activeDrugId: null,
      isDrugSheetOpen: false,
      openDrug: (id) => set({ activeDrugId: id, isDrugSheetOpen: true }),
      closeDrug: () => set({ isDrugSheetOpen: false }),

      libraryDciKey: null,
      openLibraryMonograph: (key) => set({ libraryDciKey: key, view: 'bibliotheque' }),
      clearLibraryDciKey: () => set({ libraryDciKey: null }),

      safetyTab: null,
      setSafetyTab: (tab) => set({ safetyTab: tab, view: 'securite' }),
      clearSafetyTab: () => set({ safetyTab: null }),

      filters: EMPTY_FILTERS,
      setFilter: (k, v) => set((s) => ({ filters: { ...s.filters, [k]: v } })),
      setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
      resetFilters: () => set({ filters: EMPTY_FILTERS }),

      basket: [],
      addToBasket: (item) => {
        const { basket } = get()
        if (basket.some((b) => b.id === item.id)) return 'duplicate'
        if (basket.length >= MAX_BASKET) return 'full'
        set({ basket: [...basket, item] })
        return 'added'
      },
      removeFromBasket: (id) =>
        set((s) => ({ basket: s.basket.filter((b) => b.id !== id) })),
      clearBasket: () => set({ basket: [] }),

      favorites: [],
      toggleFavorite: (item) => {
        const { favorites } = get()
        const exists = favorites.some((f) => f.id === item.id)
        if (exists) {
          set({ favorites: favorites.filter((f) => f.id !== item.id) })
        } else {
          set({
            favorites: [{ ...item, addedAt: Date.now() }, ...favorites].slice(0, MAX_FAVORITES),
          })
        }
      },
      isFavorite: (id) => get().favorites.some((f) => f.id === id),

      recentlyViewed: [],
      addRecentlyViewed: (item) => {
        const { recentlyViewed } = get()
        const filtered = recentlyViewed.filter((r) => r.id !== item.id)
        set({
          recentlyViewed: [{ ...item, viewedAt: Date.now() }, ...filtered].slice(0, MAX_RECENT),
        })
      },
    }),
    {
      name: 'dzpharm-hub-store',
      partialize: (state) => ({
        palette: state.palette,
        density: state.density,
        favorites: state.favorites,
        recentlyViewed: state.recentlyViewed,
        basket: state.basket,
      }),
    }
  )
)
