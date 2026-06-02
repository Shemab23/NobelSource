import {} from "@/api/option/room"
import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  History,
  Truck,
  Plus,
  Calendar as CalendarIcon,
  ChevronRight,
} from "lucide-react"
import { GetRoomAuditsOption } from "@/api/option/audit"
import { GetLogisticsByRoomOption } from "@/api/option/logistic" // Fixed import
import type { ApiAuditLog } from "@/api/config/types/audit"
import type { ApiLogistics } from "@/api/config/types/logistic"

/**
 * STRICT TYPING
 */
export type CalendarEvent =
  | {
      id: string
      date: Date
      title: string
      type: "audit"
      color: string
      raw: ApiAuditLog
    }
  | {
      id: string
      date: Date
      title: string
      type: "logistic"
      color: string
      raw: ApiLogistics
    }

export type FormMode = "none" | "choose" | "logistic" | "audit"

const isSameDay = (d1: Date, d2: Date) =>
  d1.toDateString() === d2.toDateString()

const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
const Legend = () => (
  <div className="mt-4 flex flex-col gap-2 border-t px-2 pt-4">
    <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase">
      <span className="h-1.5 w-4 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />{" "}
      History Log
    </div>
    <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase">
      <span className="h-1.5 w-4 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />{" "}
      Scheduled Shipment
    </div>
  </div>
)

const DetailCard = ({
  event,
  onClick,
}: {
  event: CalendarEvent
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className="group flex w-full items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-all hover:border-primary/50 hover:shadow-md active:scale-95"
  >
    <div
      className={`rounded-xl p-3 ${event.type === "audit" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}
    >
      {event.type === "audit" ? <History size={20} /> : <Truck size={20} />}
    </div>
    <div className="flex-1 overflow-hidden text-left">
      <p className="truncate text-sm font-black capitalize">{event.title}</p>
      <p className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase italic">
        {event.type === "audit"
          ? "Verified Log"
          : `Delivery • ${event.raw.status}`}
      </p>
    </div>
    <ChevronRight
      size={16}
      className="text-muted-foreground transition-transform group-hover:translate-x-1"
    />
  </button>
)
export const RoomTimelineCalendar = ({ roomId }: { roomId: string }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  // const [mode, setMode] = useState<FormMode>("none")

  const { data: audits } = useQuery(GetRoomAuditsOption(roomId))
  const { data: logistics } = useQuery(GetLogisticsByRoomOption(roomId))

  const events = useMemo((): CalendarEvent[] => {
    const list: CalendarEvent[] = []
    audits?.ans?.forEach((a) =>
      list.push({
        id: a.entity_id + a.created_at,
        date: new Date(a.created_at),
        title: a.action.replace(/_/g, " "),
        type: "audit",
        color: "#f97316",
        raw: a,
      })
    )

    // Flattening grouped logistics from RoomLogisticsGroup
    logistics?.ans?.forEach((group) => {
      group.logistics.forEach((l) =>
        list.push({
          id: l.id,
          date: new Date(l.created_at),
          title: l.transport_metadata.name,
          type: "logistic",
          color: "#3b82f6",
          raw: l,
        })
      )
    })
    return list.sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [audits, logistics])

  const activeEvents = events.filter(
    (e) => selectedDate && isSameDay(e.date, selectedDate)
  )

  return (
    <div className="mx-auto flex h-[750px] w-full max-w-7xl gap-8 p-6">
      {/* 1. SIDEBAR: NAVIGATION */}
      <div className="flex w-[320px] flex-col gap-6">
        <div className="rounded-[2.5rem] border bg-card p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <CalendarIcon size={20} />
            </div>
            <h2 className="text-sm font-black tracking-widest uppercase">
              Calendar
            </h2>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="border-none p-0"
          />
          <Legend />
        </div>
      </div>

      {/* 2. MAIN FEED: OPERATIONS */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-[2.5rem] border bg-card/50 shadow-sm">
        <div className="flex items-center justify-between border-b bg-card p-10">
          <div>
            <h3 className="text-4xl font-black tracking-tighter italic">
              {selectedDate ? formatDate(selectedDate) : "Operations"}
            </h3>
            <p className="mt-1 text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase">
              Daily Activity Feed
            </p>
          </div>
          <button
            onClick={() => alert("change the mode")}
            className="group flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:scale-105 active:scale-95"
          >
            <Plus size={18} /> Add Entry
          </button>
        </div>

        <ScrollArea className="flex-1 p-10">
          <div className="grid gap-4">
            {activeEvents.length > 0 ? (
              activeEvents.map((ev) => (
                <DetailCard key={ev.id} event={ev} onClick={() => {}} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/30">
                <Truck size={48} strokeWidth={1} />
                <p className="mt-4 text-xs font-black uppercase">
                  No records found
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* 3. MODAL OVERLAY (Controlled by 'mode' state) */}
      {/* (Insert your existing Modal logic here for 'choose', 'logistic', 'audit') */}
    </div>
  )
}
