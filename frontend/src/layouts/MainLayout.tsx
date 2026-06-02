import { Navbar } from "@/components/Navbar"
import { Outlet } from "react-router-dom"

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Navbar />
      <Outlet />
    </div>
  )
}
