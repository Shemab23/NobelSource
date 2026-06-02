import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { BellIcon, UserCircleIcon } from "@phosphor-icons/react"
import { WebName } from "@/utilits/General"
import { useGlobalContext } from "@/utilits/Hooks/General"
import { DoorOpen } from "lucide-react"

type LinksType = {
  name: string
  route: string
  icon: React.ReactNode
}

const Links: LinksType[] = [
  {
    name: "Chamber",
    route: "/Chamber",
    icon: <DoorOpen />,
  },
  {
    name: "Notifications",
    route: "/Communicate",
    icon: <BellIcon />,
  },
  {
    name: "Profile",
    route: "/Settings",
    icon: <UserCircleIcon />,
  },
]

export function Navbar() {
  const { logo } = useGlobalContext()
  const name = WebName.split(" ")
  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/60 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/MarketFeed" className="flex items-center gap-2">
              <img
                src={logo}
                className="flex h-10 w-9 items-center justify-center rounded font-black text-primary-foreground"
              />
              <p className="hidden gap-2 text-lg font-semibold tracking-tighter uppercase sm:block">
                {name[0]}
                <span className="font-extrabold text-txt-primary italic">
                  {name[1]}{" "}
                </span>
              </p>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {Links.map((link: LinksType) => (
              <Link
                key={link.route} // Don't forget the key!
                to={link.route}
                className="flex items-center justify-end gap-2 rounded-md border-2 border-muted p-1"
              >
                {/* TEXT: Hidden by default (mobile), shown on md and lg */}
                <span className="hidden md:block">{link.name}</span>

                {/* ICON: Shown on mobile (default) and lg, hidden on md */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex rounded-full bg-transparent md:hidden lg:flex"
                >
                  {link.icon}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}
