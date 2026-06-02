import { useTheme } from "@/components/theme-provider"
import { Reveal } from "@/components/MotionWrappers"
import { TermsOverlay } from "@/components/TermsOverLay"
import { Logo_Name } from "@/components/Logo_Name"
import { backgroundUrl } from "@/utilits/services/login"
import { TermsProvider } from "@/utilits/Hooks/login"
import { LoginCard } from "@/components/LoginCard"
export function Login() {
  const { theme } = useTheme()

  return (
    <TermsProvider>
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4">
        <Reveal>
          <Logo_Name />
        </Reveal>

        {/* BACKGROUND ELEMENTS */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
          }}
        />

        {/* BACKDROP blurry layer */}
        <div
          className={`absolute inset-0 z-10 backdrop-blur-[2px] ${theme === "dark" ? "bg-background/60" : "bg-background/40"}`}
        />

        {/* LOGIN CARD */}
        <Reveal className="flex w-full items-center justify-center">
          <LoginCard />
        </Reveal>

        <TermsOverlay />
      </div>
    </TermsProvider>
  )
}
