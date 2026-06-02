import { Reveal, ItemSwap, Pulse } from "@/components/MotionWrappers"
import { Slogans, WebName } from "@/utilits/General"
import { useGlobalContext } from "@/utilits/Hooks/General"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function SplashScreen() {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const { logo } = useGlobalContext()
  const webName = WebName.split(" ")
  const WORDS = Slogans

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [WORDS.length])

  useEffect(() => {
    const timer = setTimeout(() => navigate("/Login"), 12000)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      {/* 1. BRANDING SECTION wrapped in REVEAL */}
      <Reveal className="mb-12 text-center">
        <h1 className="text-5xl font-bold tracking-tighter">
          {webName[0]} <span className="text-primary">{webName[1]}</span>
        </h1>

        {/* SLOGAN wrapped in TEXTSWAP */}
        <ItemSwap itemKey={WORDS[index]} className="mt-2 h-8">
          <p className="text-xl font-medium text-muted-foreground/80">
            {WORDS[index]}
          </p>
        </ItemSwap>
      </Reveal>

      {/* 2. HEARTBEAT CENTERPIECE */}
      <Pulse className="relative z-10 flex h-48 w-48 items-center justify-center rounded-full border-2 border-primary/20 bg-background shadow-2xl shadow-primary/10">
        <img src={logo} alt="Logo" className="h-32 w-32 object-contain" />
      </Pulse>
    </div>
  )
}
