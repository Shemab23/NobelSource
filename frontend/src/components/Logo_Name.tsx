import { useGlobalContext } from "@/utilits/Hooks/General"

export const Logo_Name = () => {
  const { logo } = useGlobalContext()
  return (
    <div className="absolute top-6 left-8 z-50 flex items-center gap-2">
      <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
      <h1 className="text-2xl font-black tracking-tighter">
        Nobel<span className="text-primary">Source</span>
      </h1>
    </div>
  )
}
