import type { ViewId } from '@/components/dzpharm/store'

export const ROUTE_MAP: Record<ViewId, string> = {
  accueil: '/',
  repertoire: '/repertoire',
  bibliotheque: '/bibliotheque',
  interactions: '/interactions',
  securite: '/securite',
  outils: '/securite',
  apropos: '/a-propos',
}

export const VIEW_FROM_PATH: Partial<Record<string, ViewId>> = Object.fromEntries(
  Object.entries(ROUTE_MAP).map(([v, p]) => [p, v as ViewId])
)

export const APP_ROUTER_ENABLED =
  process.env.NEXT_PUBLIC_FEATURE_APP_ROUTER !== 'false'

export function urlForView(view: ViewId): string {
  return ROUTE_MAP[view] ?? '/'
}
