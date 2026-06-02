import React from "react"
import { useNavigate } from "react-router-dom"
import { CaretLeft, Plus } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

interface Member {
  id: string
  metadata?: {
    profile?: {
      name: string
      image?: string
    }
  }
}

interface RoomHeaderProps {
  roomName: string
  roomId: string
  members: Member[]
  onAddMember?: () => void
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({
  roomName,
  roomId,
  members,
  onAddMember,
}) => {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-4 backdrop-blur-xl md:px-8 lg:px-12">
      {/* Left Section: Navigation & Identity */}
      <div className="flex items-center gap-4 md:gap-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/Chamber")}
          className="rounded-xl border-2 transition-transform hover:scale-110 active:scale-95"
        >
          <CaretLeft weight="bold" size={20} />
        </Button>
        <div className="min-w-0">
          <h2 className="truncate text-xl leading-none font-black tracking-tighter uppercase italic md:text-2xl">
            {roomName}
          </h2>
          <p className="mt-1 text-[9px] font-black tracking-[0.2em] text-primary uppercase opacity-70 md:text-[10px] md:tracking-[0.3em]">
            {roomId} • Secure Environment
          </p>
        </div>
      </div>

      {/* Right Section: Active Entities & Invitation */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Overlapping Avatar Group */}

        <div className="flex -space-x-3 overflow-hidden">
          {members.map((m) => {
            const name = m.metadata?.profile?.name || "User"
            const initials = name.substring(0, 2).toUpperCase()

            return (
              <div
                key={m.id}
                className="h-8 w-8 overflow-hidden rounded-full border-2 border-card bg-muted shadow-sm transition-transform hover:z-10 hover:scale-110 md:h-10 md:w-10 md:border-4"
                title={name}
              >
                {m.metadata?.profile?.image ? (
                  <img
                    src={m.metadata.profile.image}
                    className="h-full w-full object-cover"
                    alt={name}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[9px] font-black uppercase md:text-[10px]">
                    {initials}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Action: Add Member */}
        <button
          onClick={onAddMember}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-dashed border-primary/40 bg-primary/5 text-primary transition-all hover:border-primary hover:bg-primary/10 active:scale-90 md:h-10 md:w-10"
          title="Invite Participant"
        >
          <Plus size={18} weight="bold" />
        </button>
      </div>
    </header>
  )
}
