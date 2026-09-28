import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/dzpharm/providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  title: 'DzPharm Hub — Référentiel Pharmaceutique & Sécurité Clinique Algérienne',
  description:
    'Nomenclature officielle de 9 555 médicaments enregistrés en Algérie (ANPP), monographies cliniques RCP, moteur d’interactions déterministe et sécurité thérapeutique.',
  keywords: [
    'DzPharm',
    'médicaments Algérie',
    'AMM Algérie',
    'interactions médicamenteuses',
    'monographies RCP',
    'ANPP',
  ],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
