'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Droplets, HeartPulse, ShieldCheck, Stethoscope } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OrdonnanceCheck } from './ordonnance-check'
import { PregnancyChecker } from './pregnancy-checker'
import { RenalCalculator } from './renal-calculator'
import { useDzPharm } from './store'

export function SafetyView() {
  const safetyTab = useDzPharm((s) => s.safetyTab)
  const clearSafetyTab = useDzPharm((s) => s.clearSafetyTab)
  const [tab, setTab] = useState(safetyTab ?? 'ordonnance')

  useEffect(() => {
    if (safetyTab) {
      setTab(safetyTab)
      clearSafetyTab()
    }
  }, [safetyTab, clearSafetyTab])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
          <ShieldCheck className="size-3.5" aria-hidden />
          <span>Vérifications &amp; Décision Thérapeutique</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Sécurité Thérapeutique &amp; Dispensation
        </h1>
        <p className="mt-1 text-sm text-muted-foreground max-w-3xl">
          Protocoles de validation d&apos;ordonnance, adaptation de clairance rénale
          (Cockcroft-Gault / MDRD) et évaluation de tératogénicité (référentiel CRAT)
          conformes aux standards cliniques algériens.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="gap-6">
        <TabsList className="scroll-thin h-12 w-full justify-start gap-1 overflow-x-auto rounded-xl p-1.5 sm:w-auto">
          <TabsTrigger
            value="ordonnance"
            className="h-9 gap-2 px-4 text-sm font-semibold data-[state=active]:shadow-sm"
          >
            <Stethoscope className="size-4" aria-hidden />
            Vérification d&apos;ordonnance
          </TabsTrigger>
          <TabsTrigger
            value="grossesse"
            className="h-9 gap-2 px-4 text-sm font-semibold data-[state=active]:shadow-sm"
          >
            <HeartPulse className="size-4" aria-hidden />
            Grossesse &amp; Allaitement (CRAT)
          </TabsTrigger>
          <TabsTrigger
            value="renal"
            className="h-9 gap-2 px-4 text-sm font-semibold data-[state=active]:shadow-sm"
          >
            <Droplets className="size-4" aria-hidden />
            Fonction Rénale &amp; Clairance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ordonnance" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <OrdonnanceCheck />
          </motion.div>
        </TabsContent>

        <TabsContent value="grossesse" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <PregnancyChecker />
          </motion.div>
        </TabsContent>

        <TabsContent value="renal" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
          >
            <RenalCalculator />
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
