/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, memo, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Plus, Upload, Truck, Clock, CheckCircle2, X } from "lucide-react"

import {
  GetLogisticsByRoomOption,
  CreateLogisticsOption,
  ReleaseLogisticsPaymentOption,
  UpdateLogisticsStatusOption,
} from "@/api/option/logistic"
import { GetRoomItemsOption } from "@/api/option/room"
import type { User } from "@/types/api"
import type { LogisticsFocusType } from "@/api/config/types/logistic"

const PIPELINE_ORDER = [
  "pending",
  "collected",
  "in_transit",
  "delivered",
  "paid",
] as const

const VerticalTracker = memo(({ currentStatus }: { currentStatus: string }) => {
  const currentIdx = PIPELINE_ORDER.indexOf(currentStatus as any)
  return (
    <div className="relative flex flex-col gap-3 py-1">
      <div className="absolute top-2 left-[7px] h-[calc(100%-8px)] w-[1.5px] bg-muted/40" />
      {PIPELINE_ORDER.map((status, idx) => {
        const isDone = idx <= currentIdx
        return (
          <div key={status} className="relative z-10 flex items-center gap-3">
            <div
              className={`h-3.5 w-3.5 rounded-full border-2 transition-all ${
                isDone
                  ? "border-green-500 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                  : "border-muted bg-background"
              }`}
            />
            <span
              className={`text-[9px] font-black tracking-tighter uppercase ${
                isDone ? "text-foreground" : "text-muted-foreground/30"
              }`}
            >
              {status.replace("_", " ")}
            </span>
          </div>
        )
      })}
    </div>
  )
})
VerticalTracker.displayName = "VerticalTracker"

const INITIAL_FORM_STATE = {
  item_id: "",
  transporter_name: "",
  plate: "",
  phone: "",
  amount: "",
}

export const RoomLogisticsManager = ({
  roomId,
}: {
  roomId: string
  currentUser: User
}) => {
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState<string | "all">("all")
  const [mode, setMode] = useState<"view" | "create" | "checkout">("view")
  const [activeShip, setActiveShip] = useState<any>(null)

  const [settleAmount, setSettleAmount] = useState("")
  const [settleRate, setSettleRate] = useState("1.0")
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [newLog, setNewLog] = useState(INITIAL_FORM_STATE)

  const { data: logisticsData } = useQuery(GetLogisticsByRoomOption(roomId))
  const { data: roomItems } = useQuery(GetRoomItemsOption(roomId))

  const resetFormState = useCallback(() => {
    setMode("view")
    setNewLog(INITIAL_FORM_STATE)
    setActiveShip(null)
    setSettleAmount("")
    setSettleRate("1.0")
    setProofFile(null)
  }, [])

  const createMutation = useMutation({
    ...CreateLogisticsOption(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["RoomLogistics", roomId] })
      resetFormState()
    },
  })

  const releaseMutation = useMutation({
    ...ReleaseLogisticsPaymentOption(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["RoomLogistics", roomId] })
      resetFormState()
    },
  })

  const updateMutation = useMutation({
    ...UpdateLogisticsStatusOption(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["RoomLogistics", roomId] })
    },
  })

  const metrics = useMemo(() => {
    let pending = 0
    let inTransit = 0
    let delivered = 0

    logisticsData?.ans?.forEach((group: any) => {
      group.logistics?.forEach((l: any) => {
        if (l.status === "pending") pending++
        if (l.status === "in_transit" || l.status === "collected") inTransit++
        if (l.status === "delivered") delivered++
      })
    })
    return { pending, inTransit, delivered }
  }, [logisticsData])

  const filteredPipeline = useMemo(() => {
    const list: any[] = []
    logisticsData?.ans?.forEach((group: any) => {
      group.logistics?.forEach((l: any) => {
        if (filter === "all" || l.status === filter) {
          list.push({
            ship: l,
            product: group.item?.analytics?.product_name || "Unknown Item",
          })
        }
      })
    })
    return list
  }, [logisticsData, filter])

  const getNextStatus = (currentStatus: string): string => {
    const idx = PIPELINE_ORDER.indexOf(currentStatus as any)
    return idx !== -1 && idx < PIPELINE_ORDER.length - 1
      ? PIPELINE_ORDER[idx + 1]
      : currentStatus
  }

  return (
    <div className="relative flex h-[820px] w-full flex-col gap-6 overflow-hidden rounded-[3rem] border bg-background p-8 shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black italic">Fleet Logistics</h2>
          <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase">
            Channel: {roomId}
          </p>
        </div>
        <button
          onClick={() => setMode("create")}
          className="flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-[11px] font-black text-white uppercase transition-transform active:scale-95"
        >
          <Plus size={16} /> New Shipment
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 rounded-2xl border bg-muted/20 p-4">
        <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm">
          <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-500">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black tracking-wider text-muted-foreground uppercase">
              Pending
            </p>
            <p className="text-xl font-black">{metrics.pending}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm">
          <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-500">
            <Truck size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black tracking-wider text-muted-foreground uppercase">
              In Transit
            </p>
            <p className="text-xl font-black">{metrics.inTransit}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-card bg-emerald-500/[0.01] p-3 shadow-sm">
          <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-500">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black tracking-wider text-muted-foreground uppercase">
              Delivered
            </p>
            <p className="text-xl font-black text-emerald-600">
              {metrics.delivered}
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-fit flex-wrap gap-1.5 rounded-2xl bg-muted/40 p-1.5">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-xl px-4 py-2 text-xs font-bold uppercase transition-all ${filter === "all" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/70"}`}
        >
          All
        </button>
        {PIPELINE_ORDER.map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-xl px-4 py-2 text-xs font-bold uppercase transition-all ${filter === status ? "bg-background text-foreground shadow-sm" : "text-muted-foreground/70"}`}
          >
            {status.replace("_", " ")}
          </button>
        ))}
      </div>

      <ScrollArea className="flex-1 pr-2">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {filteredPipeline.map(({ ship, product }) => {
            const nextStatus = getNextStatus(ship.status)
            const isDelivered = ship.status === "delivered"
            return (
              <div
                key={ship.id}
                className={`relative flex flex-col gap-4 rounded-[2rem] border bg-card p-6 shadow-sm ${isDelivered ? "border-emerald-500/30" : ""}`}
              >
                <Badge
                  variant={isDelivered ? "default" : "outline"}
                  className="w-fit text-[9px] font-black uppercase"
                >
                  {ship.status}
                </Badge>
                <VerticalTracker currentStatus={ship.status} />
                <h4 className="truncate text-lg leading-tight font-black italic">
                  {product}
                </h4>
                <div className="mt-auto flex gap-2 pt-4">
                  {ship.status !== "paid" && !isDelivered && (
                    <button
                      onClick={() =>
                        updateMutation.mutate({
                          id: ship.id,
                          data: { status: nextStatus },
                        })
                      }
                      className="w-full rounded-xl bg-muted py-3 text-[10px] font-black uppercase"
                    >
                      Advance
                    </button>
                  )}
                  {isDelivered && (
                    <button
                      onClick={() => {
                        setActiveShip(ship)
                        setSettleAmount(
                          (ship.payment?.amount_cents / 100).toString()
                        )
                        setMode("checkout")
                      }}
                      className="w-full rounded-xl bg-emerald-600 py-3 text-[10px] font-black text-white uppercase"
                    >
                      Settle
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {(mode === "create" || mode === "checkout") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md">
          {mode === "create" && (
            <form
              className="w-full max-w-lg space-y-4 rounded-[2.5rem] border bg-card p-8 shadow-2xl"
              onSubmit={(e) => {
                e.preventDefault()
                createMutation.mutate({
                  focus: "from" as LogisticsFocusType,
                  data: {
                    item_id: newLog.item_id,
                    room_id: roomId,
                    transport_metadata: {
                      type: "company",
                      name: newLog.transporter_name,
                      plate_number: newLog.plate,
                      phone: newLog.phone,
                    },
                    payment: {
                      amount_cents: Number(newLog.amount) * 100,
                      currency: "USD",
                    },
                  } as any,
                })
              }}
            >
              <h3 className="mb-4 text-xl font-black">Dispatch Contract</h3>
              <select
                value={newLog.item_id}
                onChange={(e) =>
                  setNewLog({ ...newLog, item_id: e.target.value })
                }
                className="w-full rounded-xl bg-muted p-4 text-sm font-bold"
                required
              >
                <option value="">Select Item</option>
                {roomItems?.ans?.map((i: any) => (
                  <option key={i.item.id} value={i.item.id}>
                    {i.item.analytics?.product_name}
                  </option>
                ))}
              </select>
              <input
                className="w-full rounded-xl bg-muted p-4 text-sm"
                placeholder="Carrier Name"
                onChange={(e) =>
                  setNewLog({ ...newLog, transporter_name: e.target.value })
                }
              />
              <input
                type="number"
                className="w-full rounded-xl bg-muted p-4 text-sm"
                placeholder="Amount (USD)"
                onChange={(e) =>
                  setNewLog({ ...newLog, amount: e.target.value })
                }
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={resetFormState}
                  className="w-full rounded-xl bg-muted p-4 font-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary p-4 font-black text-white"
                >
                  {createMutation.isPending ? "Dispatching..." : "Dispatch"}
                </button>
              </div>
            </form>
          )}

          {mode === "checkout" && activeShip && (
            <div className="w-full max-w-sm space-y-4 rounded-[2.5rem] border bg-card p-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black">Settlement</h3>
                <button onClick={resetFormState}>
                  <X size={20} />
                </button>
              </div>
              <input
                type="number"
                value={settleAmount}
                onChange={(e) => setSettleAmount(e.target.value)}
                className="w-full rounded-xl bg-muted p-4 text-sm"
              />
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border p-4">
                <Upload size={16} />{" "}
                <span>{proofFile?.name || "Upload Proof"}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                />
              </label>
              <button
                disabled={releaseMutation.isPending}
                onClick={() =>
                  releaseMutation.mutate({
                    id: activeShip.id,
                    data: {
                      amount: settleAmount,
                      rate: settleRate,
                      proof: proofFile as any,
                    },
                  })
                }
                className={`w-full rounded-xl p-4 font-black text-white transition-all ${releaseMutation.isPending ? "bg-emerald-800" : "bg-emerald-600"}`}
              >
                {releaseMutation.isPending
                  ? "Uploading Voucher..."
                  : "Finalize Payment"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
