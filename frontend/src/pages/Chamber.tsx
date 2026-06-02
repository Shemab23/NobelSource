/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { CaretRight, Plus, House, ShieldCheck, X } from "@phosphor-icons/react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { GetMyRoomsOption, CreateRoomOption } from "@/api/option/room"
import type { CreateRoomPayload } from "@/api/config/types/room"
import { Textarea } from "@/components/ui/textarea"

interface CreateChamberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const INITIAL_STATE: CreateRoomPayload = {
  name: "",
  metadata: {
    description: "",
    tags: [],
    goals: { monthly_target: 0, currency: "EUR" },
  },
  contract: {
    version: 1,
    introduction: "",
    metadata: {
      provider_id: "me",
      receiver_id: "PUBLIC",
      jurisdiction: "CYPRUS_REGIONAL",
    },
    sections: {
      shipment_rules: "",
      payment_terms: "",
      penalties: "",
      dispute_resolution: "",
    },
  },
}

export function CreateChamberDialog({
  open,
  onOpenChange,
}: CreateChamberDialogProps) {
  const queryClient = useQueryClient()
  const [tagInput, setTagInput] = useState("")
  const [formData, setFormData] = useState<CreateRoomPayload>(INITIAL_STATE)

  const { mutate: createRoom, isPending } = useMutation({
    ...CreateRoomOption(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["MyRooms"] })
      onOpenChange(false)
      setFormData(INITIAL_STATE)
    },
  })

  // Tag Handlers
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      const tag = tagInput.trim().toLowerCase()
      if (!formData.metadata.tags?.includes(tag)) {
        setFormData({
          ...formData,
          metadata: {
            ...formData.metadata,
            tags: [...(formData.metadata.tags || []), tag],
          },
        })
      }
      setTagInput("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-border bg-card shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-black tracking-widest uppercase">
            <ShieldCheck size={24} className="text-primary" /> Secure Protocol
            Initialization
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="identity" className="mt-4 w-full">
          <TabsList className="grid h-12 w-full grid-cols-3 rounded-xl bg-background p-1">
            <TabsTrigger
              value="identity"
              className="rounded-lg text-xs font-bold uppercase"
            >
              1. Identity
            </TabsTrigger>
            <TabsTrigger
              value="legal"
              className="rounded-lg text-xs font-bold uppercase"
            >
              2. Contract
            </TabsTrigger>
            <TabsTrigger
              value="clauses"
              className="rounded-lg text-xs font-bold uppercase"
            >
              3. Clauses
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: IDENTITY */}
          <TabsContent value="identity" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase">
                Chamber Identifier
              </Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Kigali Logistics Hub Alpha"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase">
                Description
              </Label>
              <Textarea
                value={formData.metadata.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metadata: {
                      ...formData.metadata,
                      description: e.target.value,
                    },
                  })
                }
                placeholder="Define chamber objective..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">
                  Monthly Target (Cents)
                </Label>
                <Input
                  type="number"
                  value={formData.metadata.goals?.monthly_target}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metadata: {
                        ...formData.metadata,
                        goals: {
                          ...formData.metadata.goals!,
                          monthly_target: Number(e.target.value),
                        },
                      },
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">
                  Currency
                </Label>
                <Input
                  value={formData.metadata.goals?.currency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metadata: {
                        ...formData.metadata,
                        goals: {
                          ...formData.metadata.goals!,
                          currency: e.target.value.toUpperCase(),
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase">
                Tags
              </Label>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tag and hit Enter..."
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {formData.metadata.tags?.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary uppercase"
                  >
                    {t}{" "}
                    <X
                      size={10}
                      className="cursor-pointer"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          metadata: {
                            ...formData.metadata,
                            tags: formData.metadata.tags?.filter(
                              (x) => x !== t
                            ),
                          },
                        })
                      }
                    />
                  </span>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: LEGAL */}
          <TabsContent value="legal" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase">
                Contract Introduction
              </Label>
              <Textarea
                value={formData.contract.introduction}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contract: {
                      ...formData.contract,
                      introduction: e.target.value,
                    },
                  })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">
                  Jurisdiction
                </Label>
                <Input
                  value={formData.contract.metadata?.jurisdiction}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contract: {
                        ...formData.contract,
                        metadata: {
                          ...formData.contract.metadata!,
                          jurisdiction: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">
                  Version
                </Label>
                <Input
                  type="number"
                  value={formData.contract.version}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contract: {
                        ...formData.contract,
                        version: Number(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: CLAUSES */}
          <TabsContent value="clauses" className="space-y-4 py-4">
            {Object.keys(formData.contract.sections!).map((key) => (
              <div key={key} className="grid gap-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">
                  {key.replace("_", " ")}
                </Label>
                <Textarea
                  value={(formData.contract.sections as any)[key]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contract: {
                        ...formData.contract,
                        sections: {
                          ...formData.contract.sections!,
                          [key]: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            onClick={() => createRoom(formData)}
            disabled={isPending}
            className="w-full font-bold tracking-widest uppercase"
          >
            {isPending ? "Broadcasting..." : "Execute Chamber Creation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
// --- MAIN LOBBY COMPONENT ---
export default function Chamber() {
  const navigate = useNavigate()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const {
    data: roomData,
    isLoading,
    isError,
    error,
  } = useQuery(GetMyRoomsOption())

  if (isLoading) return <LobbySkeleton />
  if (isError)
    return <div className="text-destructive p-12">Error: {error.message}</div>

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3 text-primary">
              <ShieldCheck size={32} weight="fill" />
              <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-70">
                Encrypted Environment
              </span>
            </div>
            <h1 className="mt-2 text-6xl font-black tracking-tighter text-foreground md:text-7xl">
              Chamber
            </h1>
          </div>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="h-16 gap-3 rounded-2xl bg-foreground px-10 text-xs font-black tracking-widest text-background uppercase shadow-2xl"
          >
            <Plus weight="bold" size={20} /> Secure New Chamber
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roomData?.ans.map((room) => (
            <Card
              key={room.id}
              className="group flex flex-col overflow-hidden rounded-[2.5rem] border-border/40 bg-card p-8 shadow-sm transition-all hover:-translate-y-2"
            >
              <div className="mb-8 flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <House size={28} weight="duotone" />
                </div>
                <Badge
                  variant="secondary"
                  className="rounded-lg bg-emerald-500/10 text-emerald-600"
                >
                  Ver. {room.contract.version}.0
                </Badge>
              </div>
              <h3 className="mb-3 text-2xl font-black italic">"{room.name}"</h3>
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {room.metadata.description}
              </p>
              <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-8">
                <Button
                  onClick={() => navigate(`/Chamber/${room.name}`)}
                  variant="ghost"
                  className="gap-2 p-0 text-[10px] font-black uppercase hover:bg-transparent hover:text-primary"
                >
                  Enter <CaretRight weight="bold" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <CreateChamberDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  )
}

function LobbySkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-background p-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-20 h-20 w-1/3 rounded-2xl bg-muted" />
        <div className="grid grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[380px] rounded-[2.5rem] bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}
