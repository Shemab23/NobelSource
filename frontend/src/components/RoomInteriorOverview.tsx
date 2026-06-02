/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GetRoomFinancialsOption } from "@/api/option/room"
import { GetUsersDirectoryOption } from "@/api/option/user"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { useQuery } from "@tanstack/react-query"
import { MapPin, TrendingUp } from "lucide-react"
import type { ApiRoom } from "@/api/config/types/room"
import { GetItemsByRoomOption } from "@/api/option/item"

// Helper to extract clean names from your "Producer_Name^Description" format
const sanitizeName = (raw: string | undefined) => {
  if (!raw) return "Unknown"
  return raw.split("_")[1]?.split("^")[0] || raw
}

export const RoomOverviewContent = ({ room }: { room: ApiRoom }) => {
  const { data: financialRaw, isLoading: loadingFinance } = useQuery(
    GetRoomFinancialsOption(room.id)
  )
  const { data: itemsRaw, isLoading: loadingItems } = useQuery(
    GetItemsByRoomOption(room.id)
  )
  const { data: usersRaw } = useQuery(GetUsersDirectoryOption())

  const items = itemsRaw?.ans || []
  const users = usersRaw?.ans || []

  // Enhanced Financial Normalization
  const financial = useMemo(() => {
    const data = financialRaw?.ans
    if (!data) return null
    return {
      total: data.financial_totals.gross_sales_cents / 100,
      target: data.goal_tracking.monthly_target_cents / 100,
      net: data.financial_totals.net_profit_cents / 100,
      currency: data.currency_scope,
      percent: data.goal_tracking.completion_percentage,
    }
  }, [financialRaw])

  const chartData = useMemo(() => {
    return (
      financialRaw?.ans?.weekly_trend_history.map((w: any) => ({
        week: w.week_ending,
        units: w.total_sales,
        expense: w.expense,
        demand: w.demand_score * 10, // Scaled for visual alignment
      })) || []
    )
  }, [financialRaw])

  const latest = financialRaw?.ans?.weekly_trend_history?.slice(-1)[0]

  if (loadingFinance || loadingItems)
    return (
      <div className="animate-pulse p-20 text-center font-black text-muted-foreground">
        SYNCHRONIZING OPERATIONAL NODES...
      </div>
    )

  return (
    <div className="space-y-8 p-2">
      {/* SECTION 1: CAPITAL FLOW */}
      <div className="relative overflow-hidden rounded-[2rem] bg-primary p-8 text-white shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-5xl font-black tracking-tighter italic">
              {financial?.percent.toFixed(1)}%
            </h2>
            <p className="text-xs font-bold uppercase opacity-60">
              Monthly Target Achievement
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-black opacity-80">NET PROFIT</p>
            <p className="text-2xl font-black">
              {financial?.net.toLocaleString()} {financial?.currency}
            </p>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="mt-8 h-4 w-full rounded-sm border border-white/10 bg-white/20">
          <div
            className="h-full bg-white transition-all duration-1000"
            style={{ width: `${Math.min(financial?.percent || 0, 100)}%` }}
          />
        </div>
      </div>

      {/* SECTION 2: ANALYTICS GRID */}
      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="rounded-[2rem] p-8 lg:col-span-2">
          <div className="mb-8 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            <h3 className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">
              Market Track Velocity
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.2}
                />
                <XAxis dataKey="week" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ borderRadius: "1rem" }} />
                <Bar
                  dataKey="units"
                  name="Sales"
                  fill="var(--primary)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expense"
                  name="Expenses"
                  fill="var(--destructive)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* ROOM PULSE */}
        <Card className="flex flex-col justify-between rounded-[2rem] bg-muted/30 p-8">
          <h3 className="mb-6 text-[10px] font-black uppercase opacity-50">
            Operational Integrity
          </h3>
          <div className="space-y-6">
            {[
              {
                label: "Demand Score",
                val: `${latest?.demand_score.toFixed(1) || 0}/10`,
              },
              {
                label: "Active Listings",
                val: financialRaw?.ans?.pipeline_summary.active_listings || 0,
              },
              {
                label: "Integrity Status",
                val: financialRaw?.ans?.inventory_integrity.status || "STABLE",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex items-end justify-between border-b border-border/50 pb-4"
              >
                <p className="text-[10px] font-black uppercase opacity-60">
                  {stat.label}
                </p>
                <p className="text-xl font-black italic">{stat.val}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ACTIVE INVENTORY MAP */}
      <div className="space-y-4">
        <h3 className="px-2 text-[10px] font-black tracking-widest text-primary uppercase">
          Active Collaboration Threads
        </h3>
        {items.map((item: any) => {
          const seller = users.find(
            (u: any) => u.id === item.analytics.participants.seller_id
          )
          const buyer = users.find(
            (u: any) => u.id === item.analytics.participants.buyer_id
          )
          return (
            <Card key={item.id} className="rounded-[1.5rem] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black uppercase">
                    {item.analytics.product_name}
                  </h4>
                  <Badge variant="secondary" className="mt-1">
                    {item.analytics.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-muted/40 p-3">
                  <MapPin size={14} className="text-primary" />
                  <p className="text-xs font-bold">
                    {sanitizeName(seller?.metadata.profile.name)}{" "}
                    <span className="text-primary">&</span>{" "}
                    {sanitizeName(buyer?.metadata.profile.name)}
                  </p>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
