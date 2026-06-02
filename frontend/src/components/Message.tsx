import { ArrowLeftIcon, QrCodeIcon, ShieldCheckIcon } from "lucide-react"
import { Button } from "./ui/button"
import { ChatCircleTextIcon, LockKeyIcon } from "@phosphor-icons/react"
import { Input } from "./ui/input"

const COMM_FILTERS = ["proposal", "negotiation", "logistics", "system"] as const
type CommType = (typeof COMM_FILTERS)[number]
type ShipmentStatus = "collection" | "in_transit" | "delivered"

interface LogEntry {
  id: string
  user: string
  content: string
  time: string
  isSystem?: boolean
}

interface Message {
  id: string
  type: CommType
  sender: string
  title: string
  isProtected: boolean
  timestamp: Date
  details: string
  logs: LogEntry[]
  shipment?: {
    status: ShipmentStatus
    lastLog: string
    driverName: string
    manifest: string[]
  }
  proposalData?: {
    votesFor: number
    votesAgainst: number
    threshold: number
    legalId: string
  }
}

type props = {
  selectedMsg: Message | null
  setSelectedMsg: (msg: Message | null) => void
}
export const Message = ({ selectedMsg, setSelectedMsg }: props) => {
  return (
    <div
      className={`relative flex min-h-[700px] flex-col rounded-[2.5rem] border bg-card/30 lg:col-span-8 ${!selectedMsg ? "hidden lg:flex" : "flex"}`}
    >
      {selectedMsg ? (
        <div className="flex h-full flex-col">
          {/* TOP NAV */}
          <div className="flex items-center justify-between border-b p-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSelectedMsg(null)}
              >
                <ArrowLeftIcon size={20} />
              </Button>
              <div>
                <h2 className="text-xl font-black tracking-tight">
                  {selectedMsg.title}
                </h2>
                <p className="text-[10px] font-black tracking-widest text-primary uppercase">
                  {selectedMsg.sender}
                </p>
              </div>
            </div>
            {selectedMsg.isProtected && (
              <LockKeyIcon size={20} className="text-orange-500" />
            )}
          </div>

          {/* DYNAMIC VIEW CONTENT */}
          <div className="flex-1 space-y-8 overflow-y-auto p-6">
            {selectedMsg.type === "logistics" && selectedMsg.shipment && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-4">
                    <p className="mb-2 text-[9px] font-black text-blue-500 uppercase">
                      Manifest
                    </p>
                    <ul className="space-y-1 text-[10px] font-bold">
                      {selectedMsg.shipment.manifest.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-muted/30 p-4 md:col-span-2">
                    <p className="mb-4 text-[9px] font-black text-muted-foreground uppercase">
                      Tracking Status
                    </p>
                    <div className="relative flex justify-between px-2">
                      <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-muted" />
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className={`relative z-10 h-4 w-4 rounded-full border-4 border-background ${i <= 1 ? "bg-blue-500" : "bg-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <Button className="h-12 w-full rounded-xl bg-blue-600 text-[10px] font-black uppercase">
                  <QrCodeIcon className="mr-2" size={18} /> Receive Asset
                </Button>
              </div>
            )}

            {/* AUDIT LOG SECTION */}
            <div className="space-y-4 border-t pt-8">
              <h4 className="flex items-center gap-2 text-[10px] font-black tracking-tighter text-muted-foreground uppercase">
                <ShieldCheckIcon size={16} /> Audit Log Stream
              </h4>
              {selectedMsg.logs.map((log) => (
                <div
                  key={log.id}
                  className={`flex gap-3 ${log.isSystem ? "opacity-60" : ""}`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
                    {log.user[0]}
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase">
                        {log.user}
                      </span>
                      <span className="text-[8px] font-bold text-muted-foreground">
                        {log.time}
                      </span>
                    </div>
                    <p className="rounded-2xl rounded-tl-none border border-muted/20 bg-muted/20 p-3 text-xs">
                      {log.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER INPUT */}
          <div className="border-t bg-card/50 p-6">
            <div className="flex items-center gap-2 rounded-2xl border border-muted-foreground/10 bg-muted/40 p-1 pr-2">
              <Input
                placeholder="Post log or negotiate terms..."
                className="border-none bg-transparent text-sm shadow-none focus-visible:ring-0"
              />
              <Button className="h-9 rounded-xl px-6 text-[10px] font-black uppercase">
                Execute
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center p-12 text-center opacity-20">
          <ChatCircleTextIcon size={80} weight="thin" className="mb-4" />
          <h3 className="text-xl font-black uppercase">Nobel Source Engine</h3>
          <p className="max-w-xs text-sm font-medium">
            Select a stream to engage in high-security logistics or asset
            negotiation.
          </p>
        </div>
      )}
    </div>
  )
}
