import React from "react"
import {
  Database,
  ShieldCheck,
  Calendar,
  Chats,
  Truck,
  type Icon,
} from "@phosphor-icons/react"

interface Tab {
  id: string
  label: string
  icon: Icon
  hasNotification?: boolean
}

interface RoomNavbarProps {
  activeTab: string
  setActiveTab: (id: string) => void
  // Passing notifications as a map of tabId: boolean
  notifications?: Record<string, boolean>
}

const TABS: Tab[] = [
  { id: "overview", icon: Database, label: "Overview" },
  { id: "contract", icon: ShieldCheck, label: "Contract" },
  { id: "plan", icon: Calendar, label: "Plan" },
  { id: "communication", icon: Chats, label: "Communication" },
  { id: "logistics", icon: Truck, label: "Logistics" },
]

export const RoomNavbar: React.FC<RoomNavbarProps> = ({
  activeTab,
  setActiveTab,
  notifications = {},
}) => {
  return (
    <nav className="sticky top-18.25 z-40 w-full border-b bg-background/60 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-center gap-2 px-4 sm:gap-8 md:px-8 lg:px-12">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id
          const hasAlert = notifications[tab.id]

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group relative flex h-full items-center gap-2 border-b-2 px-1 text-[10px] font-black tracking-widest uppercase transition-all sm:px-2 ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {/* Icon: Hidden on small, shown on xs and md+ */}
              <tab.icon
                size={18}
                weight={isActive ? "fill" : "bold"}
                className="block sm:hidden md:block"
              />

              {/* Label: Shown on sm+, Hidden on xs */}
              <span className="hidden sm:inline">{tab.label}</span>

              {/* Notification Dot */}
              {hasAlert && (
                <span className="absolute top-3 right-0 h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
