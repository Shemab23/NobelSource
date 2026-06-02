import { FormItem, StaggeredForm } from "./MotionWrappers"
import { useNavigate } from "react-router-dom"
import { useTerms } from "@/utilits/Hooks/login"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LoginOption } from "@/api/option/auth"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// --- SHADCN UI COMPONENT IMPORTS ---
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WarningCircleIcon, XIcon } from "@phosphor-icons/react"

export const LoginCard = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { setShowTerms } = useTerms()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // --- Auto-Dismiss Timer Logic ---
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  // --- TanStack Query Login Mutation Layer ---
  const { mutate, isPending } = useMutation({
    ...LoginOption(),
    onSuccess: (data) => {
      if (data?.msg === "success") {
        queryClient.invalidateQueries()
        navigate("/MarketFeed")
      }
    },
    onError: (err) => {
      console.error("Login mutation failure:", err)
      setErrorMessage(
        err?.message || "Invalid business email or credential combination."
      )
    },
  })

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage(null)
    mutate({ email, password })
  }

  return (
    <div className="chamber-surface relative z-20 w-full max-w-md border-4 border-border bg-card/80 p-10 backdrop-blur-xl">
      {/* TOP CENTER ANNOTATION TOAST NOTIFICATION BANNER */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-6 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4"
          >
            <Alert
              variant="destructive"
              className="border-destructive/30 text-destructive relative flex items-start rounded-xl border bg-card/95 p-4 shadow-2xl backdrop-blur-md"
            >
              <WarningCircleIcon
                size={18}
                className="text-destructive mt-0.5 shrink-0"
                weight="fill"
              />
              <div className="ml-3 flex-1 pr-6 text-left">
                <AlertTitle className="text-sm font-bold tracking-tight text-foreground">
                  Security Gateway Exception
                </AlertTitle>
                <AlertDescription className="mt-0.5 text-xs leading-relaxed font-medium text-muted-foreground">
                  {errorMessage}
                </AlertDescription>
              </div>

              {/* KILL BUTTON */}
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="hover:bg-destructive/10 hover:text-destructive absolute top-3.5 right-3.5 rounded-lg p-1 text-muted-foreground/60 transition-colors active:scale-95"
                aria-label="Dismiss Alert"
              >
                <XIcon size={16} weight="bold" />
              </button>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-10 text-center">
        <h2 className="heading-chamber text-3xl">Login Form</h2>
        <p className="label-serious mt-2">-- Secure Logistics Access --</p>
      </div>

      {/* THE FORM */}
      <form onSubmit={handleLogin}>
        <StaggeredForm className="space-y-6">
          <FormItem className="space-y-2">
            <label className="label-serious block">Business Email</label>
            <input
              type="email"
              name="email"
              value={email}
              required
              disabled={isPending}
              placeholder="name@domain.com"
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 ring-primary/30 transition-all outline-none focus:ring-2 disabled:opacity-50"
            />
          </FormItem>

          <FormItem className="space-y-2">
            <label className="label-serious block">Credentials</label>
            <input
              type="password"
              name="password"
              value={password}
              required
              disabled={isPending}
              placeholder="••••••••"
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 ring-primary/30 transition-all outline-none focus:ring-2 disabled:opacity-50"
            />
          </FormItem>

          <FormItem className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl bg-primary py-4 font-bold text-primary-foreground shadow-lg shadow-primary/10 transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Processing...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => navigate("/Register")}
              className="flex-1 rounded-xl border border-border bg-muted/20 py-4 font-bold transition-all hover:bg-muted/40 disabled:opacity-50"
            >
              Register
            </button>
          </FormItem>

          <FormItem className="text-center">
            <button
              type="button"
              disabled={isPending}
              onClick={() => setShowTerms(true)}
              className="text-sm font-black tracking-widest text-txt-cta uppercase hover:underline disabled:opacity-50"
            >
              Nobel Source terms and conditions
            </button>
          </FormItem>
        </StaggeredForm>
      </form>
    </div>
  )
}
