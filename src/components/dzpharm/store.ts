import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DesignMode, PaletteId } from './types'

export type ViewId =
  | 'accueil'
  | 'repertoire'
  | 'bibliotheque'
  | 'interactions'
  | 'securite'
  | 'outils'
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

export interface PinnedPatient {
  id?: string
  name?: string
  ageYears?: number
  weightKg?: number
  gender?: 'M' | 'F'
  clcr?: number
  childPughClass?: 'A' | 'B' | 'C'
  isPregnant?: boolean
  pregnancyTrimester?: 1 | 2 | 3
  isBreastfeeding?: boolean
  allergies?: string[]
  pinnedAt: string
}

export type AddResult = 'added' | 'duplicate' | 'full'
export type DensityMode = 'compact' | 'standard' | 'spacious'

export const MAX_BASKET = 10
export const MAX_FAVORITES = 30
export const MAX_RECENT = 8

export interface DzPharmState {
  // Navigation
  view: ViewId
  setView: (v: ViewId) => void
  gotoDirectory: (patch?: Partial<DirectoryFilters>) => void

  // Thème & Nuancier
  designMode: DesignMode
  setDesignMode: (m: DesignMode) => void
  palette: PaletteId
  setPalette: (p: PaletteId) => void
  paletteOpen: boolean
  setPaletteOpen: (open: boolean) => void
  density: DensityMode
  setDensity: (d: DensityMode) => void

  // Scanner & Modal Barcode
  scannerOpen: boolean
  setScannerOpen: (open: boolean) => void
  adminBarcodeModalOpen: boolean
  setAdminBarcodeModalOpen: (open: boolean) => void
  openAdminBarcodeForDrug: (id: number) => void

  // Fiche médicament (sliding sheet)
  sheetDrugId: number | null
  activeDrugId: number | null
  isDrugSheetOpen: boolean
  openDrug: (id: number) => void
  closeDrug: () => void

  // Navigation vers la bibliothèque (Monographie ciblée)
  libraryDciKey: string | null
  openLibraryMonograph: (dciKey: string) => void
  closeLibraryMonograph: () => void
  clearLibraryDciKey: () => void

  // Navigation vers les outils de sécurité
  safetyTab: string | null
  toolsTab: string | null
  setSafetyTab: (tab: string) => void
  openTool: (tab: string) => void
  clearSafetyTab: () => void
  clearToolsTab: () => void

  // Patient épinglé
  pinnedPatient: PinnedPatient | null
  setPinnedPatient: (patient: PinnedPatient | null) => void

  // Filtres du répertoire
  filters: DirectoryFilters
  setFilter: <K extends keyof DirectoryFilters>(k: K, v: DirectoryFilters[K]) => void
  setFilters: (f: Partial<DirectoryFilters>) => void
  resetFilters: () => void

  // Panier d'interactions
  basket: BasketItem[]
  setBasket: (items: BasketItem[]) => void
  addToBasket: (item: BasketItem) => AddResult
  removeFromBasket: (id: number) => void
  clearBasket: () => void

  // Favoris
  favorites: FavoriteItem[]
  toggleFavorite: (item: Omit<FavoriteItem, 'addedAt'>) => 'added' | 'removed' | 'full'
  isFavorite: (id: number) => boolean

  // Historique récent
  recentlyViewed: RecentItem[]
  addRecentlyViewed: (item: Omit<RecentItem, 'viewedAt'>) => void
  pushRecent: (item: Omit<RecentItem, 'viewedAt'>) => void
}

export const useDzPharm = create<DzPharmState>()(
  persist(
    (set, get) => ({
      view: 'accueil',
      setView: (view) => set({ view }),
      gotoDirectory: (patch) =>
        set((s) => ({
          view: 'repertoire',
          filters: patch ? { ...EMPTY_FILTERS, ...patch } : s.filters,
        })),

      designMode: 'standard',
      setDesignMode: (designMode) => set({ designMode }),
      palette: 'porcelain',
      setPalette: (palette) => set({ palette }),
      paletteOpen: false,
      setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
      density: 'standard',
      setDensity: (density) => set({ density }),

      scannerOpen: false,
      setScannerOpen: (scannerOpen) => set({ scannerOpen }),
      adminBarcodeModalOpen: false,
      setAdminBarcodeModalOpen: (adminBarcodeModalOpen) => set({ adminBarcodeModalOpen }),
      openAdminBarcodeForDrug: (_id) => set({ adminBarcodeModalOpen: true }),

      sheetDrugId: null,
      activeDrugId: null,
      isDrugSheetOpen: false,
      openDrug: (id) =>
        set({
          sheetDrugId: id,
          activeDrugId: id,
          isDrugSheetOpen: true,
        }),
      closeDrug: () =>
        set({
          sheetDrugId: null,
          activeDrugId: null,
          isDrugSheetOpen: false,
        }),

      libraryDciKey: null,
      openLibraryMonograph: (key) => set({ libraryDciKey: key, view: 'bibliotheque' }),
      closeLibraryMonograph: () => set({ libraryDciKey: null }),
      clearLibraryDciKey: () => set({ libraryDciKey: null }),

      safetyTab: null,
      toolsTab: null,
      setSafetyTab: (tab) => set({ safetyTab: tab, toolsTab: tab, view: 'securite' }),
      openTool: (tab) => set({ toolsTab: tab, safetyTab: tab, view: 'securite' }),
      clearSafetyTab: () => set({ safetyTab: null, toolsTab: null }),
      clearToolsTab: () => set({ toolsTab: null, safetyTab: null }),

      pinnedPatient: null,
      setPinnedPatient: (pinnedPatient) => set({ pinnedPatient }),

      filters: EMPTY_FILTERS,
      setFilter: (k, v) => set((s) => ({ filters: { ...s.filters, [k]: v } })),
      setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
      resetFilters: () => set({ filters: EMPTY_FILTERS }),

      basket: [],
      setBasket: (basket) => set({ basket }),
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
          return 'removed'
        }
        if (favorites.length >= MAX_FAVORITES) return 'full'
        set({
          favorites: [{ ...item, addedAt: Date.now() }, ...favorites].slice(0, MAX_FAVORITES),
        })
        return 'added'
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
      pushRecent: (item) => {
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
