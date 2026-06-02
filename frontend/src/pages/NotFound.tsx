import * as React from "react"
import { motion } from "framer-motion"
import {
  ShieldWarningIcon,
  ArrowLeftIcon,
  HouseIcon,
  MagnifyingGlassIcon,
  WarningOctagonIcon,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

export const NotFound = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-6 font-sans text-foreground antialiased">
      {/* BACKGROUND DECOR (Subtle Security Grid) */}
      <div className="absolute inset-0 z-0 [background-image:linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]" />

      <main className="relative z-10 flex flex-col items-center text-center">
        {/* LOGO / ICON */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-orange-500/10 text-orange-500 shadow-2xl shadow-orange-500/10"
        >
          <WarningOctagonIcon size={48} weight="duotone" />
        </motion.div>

        {/* ERROR MESSAGE */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-1 bg-primary" />
            <h1 className="text-sm font-black tracking-[0.4em] text-muted-foreground uppercase">
              Protocol Error 404
            </h1>
          </div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic md:text-6xl">
            Route Not Indexed
          </h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed font-medium text-muted-foreground/80">
            The Nobel Source ledger cannot locate the requested directory.
            Access may be restricted, or the resource has been moved to a
            secured archive.
          </p>
        </div>

        {/* NAVIGATION ACTIONS */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="default"
            className="h-12 rounded-2xl px-8 text-[10px] font-black tracking-widest uppercase transition-all hover:scale-105"
            onClick={() => (window.location.href = "/")}
          >
            <HouseIcon className="mr-2" size={18} /> Return to Dashboard
          </Button>

          <Button
            variant="outline"
            className="h-12 rounded-2xl border-none bg-muted/50 px-8 text-[10px] font-black tracking-widest uppercase"
            onClick={() => window.history.back()}
          >
            <ArrowLeftIcon className="mr-2" size={18} /> Previous Sector
          </Button>
        </div>

        {/* SECURITY FOOTER */}
        <div className="mt-16 flex items-center gap-4 border-t border-muted pt-8 opacity-30">
          <div className="flex items-center gap-1 text-[9px] font-black tracking-widest uppercase">
            <ShieldWarningIcon size={14} />
            Auto-Audit Logged
          </div>
          <div className="h-1 w-1 rounded-full bg-muted-foreground" />
          <div className="text-[9px] font-black tracking-widest uppercase">
            Nobel Source v4.0
          </div>
        </div>
      </main>

      {/* MINI CODE AUDIT (For your tracker) */}
      <div className="mt-20 w-full max-w-2xl border-t border-dashed pt-8 opacity-40 grayscale transition-all hover:opacity-100 hover:grayscale-0">
        <h3 className="mb-4 text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
          Dev Integrity Log
        </h3>
        <div className="rounded-xl border bg-card/30 p-4">
          <p className="font-mono text-[10px] leading-relaxed">
            [SYSTEM_STRUGGLE]: Client attempted to access a non-existent route.
            <br />
            [RESOLUTION]: Graceful intercept triggered. Redirecting focus to
            valid entities.
          </p>
        </div>
      </div>
    </div>
  )
}
