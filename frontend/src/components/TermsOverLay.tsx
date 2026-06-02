import { termsData } from "@/utilits/services/login"
import { AnimatePresence } from "framer-motion"
import { ModalCard, Overlay } from "./MotionWrappers"
import { useTerms } from "@/utilits/Hooks/login"

export function TermsOverlay() {
  const { showTerms, setShowTerms } = useTerms()

  return (
    <AnimatePresence>
      {showTerms && (
        <Overlay
          className="z-50 flex animate-in items-center justify-center bg-black/70 p-4 backdrop-blur-md duration-200 fade-in"
          onClick={() => setShowTerms(false)}
        >
          <ModalCard
            className="relative flex max-h-[85vh] w-full max-w-2xl animate-in flex-col overflow-hidden rounded-3xl border border-border/80 bg-card/95 text-card-foreground shadow-2xl backdrop-blur-xl duration-300 zoom-in-95"
            onClick={() => setShowTerms(false)} // Prevents closing when clicking card body
          >
            {/* Header: Fixed top banner with sticky blur styling */}
            <div className="border-b border-border/60 bg-muted/30 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <h2 className="heading-chamber text-2xl font-bold tracking-tight text-foreground">
                  {termsData.title}
                </h2>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/20">
                  v{termsData.version}
                </span>
              </div>
              <p className="label-serious mt-1 text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Last System Audit: {termsData.lastUpdated}
              </p>
            </div>

            {/* Scrollable Content: Deep reading space with enhanced typography */}
            <div className="scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent flex-1 space-y-6 overflow-y-auto p-8 text-sm leading-relaxed">
              {termsData.sections.map((section) => (
                <div
                  key={section.id}
                  className="group relative rounded-2xl border border-transparent p-4 transition-all duration-200 hover:border-border/40 hover:bg-muted/10"
                >
                  <div className="flex items-start gap-3">
                    {/* Visual Anchor Indicator badge */}
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground">
                      {section.id}
                    </span>
                    <div className="space-y-1.5">
                      <h3 className="font-heading text-base font-bold tracking-tight text-foreground">
                        {section.heading}
                      </h3>
                      <p className="text-justify text-[13.5px] leading-relaxed font-normal text-muted-foreground">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Informative Warning Banner */}
              <div className="flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-primary/90 italic">
                <span className="text-sm">🛡️</span>
                <div>
                  By utilizing the NobelSource Hub, you explicitly agree to
                  facilitate a fair, auditable, and transparent logistics supply
                  chain. All automated smart penalties and arbitrator bindings
                  are processed natively under system protocol conditions.
                </div>
              </div>
            </div>

            {/* Footer: Action drawer */}
            <div className="flex items-center justify-end gap-4 border-t border-border/60 bg-muted/20 p-6">
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="rounded-xl bg-primary px-8 py-3.5 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:brightness-110 active:scale-[0.98]"
              >
                Accept & Continue
              </button>
            </div>
          </ModalCard>
        </Overlay>
      )}
    </AnimatePresence>
  )
}
