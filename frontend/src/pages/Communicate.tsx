/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react"
import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query"
import {
  ArrowLeft,
  ChatCircleDots,
  PaperPlaneTilt,
  Plus,
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// --- Central Api Option Imports ---
import { GetMyMessagesOption, CreateMessageOption } from "@/api/option/messag"
import { GetMeOption, GetUserByIdOption } from "@/api/option/user"

// --- Central Payload Interfaces ---
import type { CreateMessagePayload } from "@/api/config/types/message"

/**
 * Parses message blocks adhering to the split delimiter logic
 * Format: ^[time](senderIndex) textContent
 */
const parseMessageBody = (body: string) => {
  if (!body) return []
  return body
    .split("^")
    .filter(Boolean)
    .map((segment) => {
      const regex = /^\[(.*?)\]\((.*?)\)\s*(.*)$/
      const match = segment.trim().match(regex)
      if (!match) return { time: "", role: "", content: segment }

      return {
        time: match[1] || "",
        role: match[2] || "",
        content: match[3] || "",
      }
    })
}

/**
 * Proprietary identity name extraction rule
 * Structure: Title_TradeName^SummaryDescription -> returns TradeName
 */
const extractParticipantName = (rawName?: string): string => {
  if (!rawName) return "Loading..."
  try {
    const splitUp = rawName.split("^")[0].split("_")[1]
    return splitUp || "New Entity"
  } catch {
    return "New Entity"
  }
}

export default function Communicate() {
  const queryClient = useQueryClient()

  // Core Queries
  const { data: messagesData, isLoading: messagesLoading } = useQuery(
    GetMyMessagesOption()
  )
  const { data: me } = useQuery(GetMeOption())

  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [replyBody, setReplyBody] = useState("")
  const [targetId, setTargetId] = useState("")

  // Secure Transmission Mutation bound to strict payload interface
  const { mutate: sendMessage, isPending } = useMutation({
    ...CreateMessageOption(),
    onSuccess: () => {
      setReplyBody("")
      setTargetId("")
      setIsCreatingNew(false)
      queryClient.invalidateQueries({ queryKey: ["MyMessages"] })
    },
  })

  // Group message items by active spaces
  const rooms = useMemo(() => {
    const raw = messagesData?.ans || []
    return raw.reduce(
      (
        acc: Record<string, { messages: any[]; participants: string[] }>,
        msg: any
      ) => {
        const roomKey = msg.room_id || "Direct_Messages"
        if (!acc[roomKey]) {
          acc[roomKey] = {
            messages: [],
            participants: msg.participants || [],
          }
        }
        acc[roomKey].messages.push(msg)
        return acc
      },
      {}
    )
  }, [messagesData])

  // Isolate active participants list to mount metadata scanners
  const activeParticipantsList = useMemo(() => {
    if (!selectedRoom || !rooms[selectedRoom]) return []
    return rooms[selectedRoom].participants
  }, [selectedRoom, rooms])

  // Hydrate profiles in parallel to completely drop "Unknown" user flags
  const participantQueries = useQueries({
    queries: activeParticipantsList.map((id) => ({
      ...GetUserByIdOption(id),
      enabled: !!id,
    })),
  })

  const metadataLoading = participantQueries.some((q) => q.isLoading)

  const participantsMap = useMemo(() => {
    const mapping: Record<string, any> = {}
    participantQueries.forEach((query, index) => {
      const entityId = activeParticipantsList[index]
      if (entityId && query.data?.ans) {
        mapping[entityId] = query.data.ans
      }
    })
    return mapping
  }, [participantQueries, activeParticipantsList])

  const myIndex = useMemo(() => {
    const myId = me?.ans?.id
    if (!myId || !selectedRoom || !rooms[selectedRoom]) return null
    const foundIndex = rooms[selectedRoom].participants.indexOf(myId)
    return foundIndex !== -1 ? foundIndex.toString() : null
  }, [me, selectedRoom, rooms])

  const handleSend = () => {
    if (isCreatingNew && (!targetId.trim() || !replyBody.trim())) return
    if (!isCreatingNew && (!selectedRoom || !replyBody.trim())) return

    const timeString = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })

    const targetRoomId =
      selectedRoom === "Direct_Messages" ? null : selectedRoom
    const targetRecipientId = isCreatingNew
      ? targetId.trim()
      : selectedRoom === "Direct_Messages"
        ? rooms["Direct_Messages"]?.participants.find(
            (id: string) => id !== me?.ans?.id
          )
        : null

    // Build payload complying strictly with CreateMessagePayload signature
    const payload: CreateMessagePayload = {
      room_id: isCreatingNew ? null : targetRoomId,
      to_id: targetRecipientId || null,
      body: `^[${timeString}](${myIndex || "0"}) ${replyBody.trim()}`,
      message_flag: "chat",
      metadata: {
        type: "system_notice",
      },
    }

    sendMessage(payload)
  }

  // --- RENDERING ROUTINE 1: INBOX SCREEN VIEW ---
  if (!selectedRoom && !isCreatingNew) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl animate-in flex-col p-8 pt-12 duration-200 fade-in">
        <div className="mb-8 flex items-center justify-between border-b pb-4">
          <h1 className="text-4xl font-black tracking-tight text-foreground uppercase">
            INBOX
          </h1>
          <Button
            onClick={() => setIsCreatingNew(true)}
            className="gap-2 font-semibold"
          >
            <Plus size={20} weight="bold" /> START NEW TRANSMISSION
          </Button>
        </div>

        {messagesLoading && (
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground italic">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            Synchronizing message feed logs...
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {Object.entries(rooms).map(([roomId, data]: [string, any]) => (
            <button
              key={roomId}
              type="button"
              onClick={() => setSelectedRoom(roomId)}
              className="group flex w-full items-center justify-between rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:border-border/80 hover:bg-muted/40"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-primary/10 p-3 text-primary transition-transform duration-200 group-hover:scale-105">
                  <ChatCircleDots size={24} weight="fill" />
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">
                    {roomId === "Direct_Messages"
                      ? "Private Channels Ledger"
                      : `Workspace Room: ${roomId}`}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-muted-foreground">
                    Thread logs: {data.messages.length} secure updates verified
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // --- RENDERING ROUTINE 3: FRESH NEW TRANSMISSION VIEW ---
  if (isCreatingNew) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-2xl animate-in flex-col p-6 pt-12 duration-300 slide-in-from-bottom-4">
        <Button
          variant="ghost"
          onClick={() => setIsCreatingNew(false)}
          className="mb-6 w-fit text-xs font-bold uppercase"
        >
          <ArrowLeft className="mr-2" weight="bold" /> BACK TO LEDGER
        </Button>

        <div className="space-y-6 rounded-3xl border bg-card p-8 shadow-sm">
          <h2 className="border-b pb-4 text-2xl font-black tracking-tight">
            New Direct Transmission
          </h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Recipient Account ID
              </label>
              <Input
                placeholder="Prefix identification code (e.g. USR_...)"
                value={targetId}
                disabled={isPending}
                onChange={(e) => setTargetId(e.target.value)}
                className="rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Secure Payload Content
              </label>
              <Input
                placeholder="Type transmission content stream parameters..."
                value={replyBody}
                disabled={isPending}
                onChange={(e) => setReplyBody(e.target.value)}
                className="rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    targetId.trim() &&
                    replyBody.trim() &&
                    !isPending
                  )
                    handleSend()
                }}
              />
            </div>
          </div>

          <Button
            onClick={handleSend}
            disabled={!targetId.trim() || !replyBody.trim() || isPending}
            className="relative flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold"
          >
            {isPending && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            )}
            {isPending ? "Broadcasting Stream..." : "INITIALIZE TRANSMISSION"}
          </Button>
        </div>
      </div>
    )
  }

  // --- RENDERING ROUTINE 2: TIMELINE THREAD VIEW ---
  return (
    <div className="mx-auto flex h-screen max-w-2xl animate-in flex-col p-6 duration-200 fade-in">
      <header className="mb-4 flex items-center justify-between border-b pb-4">
        <Button
          variant="ghost"
          onClick={() => setSelectedRoom(null)}
          className="rounded-xl text-xs font-bold tracking-tight uppercase"
        >
          <ArrowLeft className="mr-2" weight="bold" /> BACK TO LEDGER
        </Button>
        {metadataLoading && (
          <span className="animate-pulse rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary uppercase">
            Hydrating Profile Models...
          </span>
        )}
      </header>

      {/* CHAT THREAD DISPLAY FRAME */}
      <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto rounded-2xl border bg-muted/10 p-4">
        {rooms[selectedRoom!]?.messages
          .flatMap((m: any) => parseMessageBody(m.body))
          .map((msg: any, i: number) => {
            const parsedRoleIndex = parseInt(msg.role)
            const targetParticipantId =
              rooms[selectedRoom!]?.participants[parsedRoleIndex]

            const participantRecord = participantsMap[targetParticipantId]
            const isMe = targetParticipantId === me?.ans?.id

            const displayName = extractParticipantName(
              participantRecord?.metadata?.profile?.name
            )

            return (
              <div
                key={i}
                className={`flex flex-col ${isMe ? "items-end text-right" : "items-start text-left"} animate-in duration-200 fade-in`}
              >
                <span className="mb-1 text-[10px] font-bold tracking-wider text-muted-foreground uppercase opacity-70">
                  {isMe
                    ? `YOU (${displayName}) • ${msg.time || "Recent"}`
                    : `${displayName || targetParticipantId} • ${msg.time}`}
                </span>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed font-medium shadow-sm ${
                    isMe
                      ? "rounded-tr-none bg-primary text-primary-foreground"
                      : "rounded-tl-none border bg-card text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            )
          })}
      </div>

      {/* FOOTER ACTION DRAWER INPUT */}
      <div className="mt-4 flex gap-2 border-t border-border/60 pt-4">
        <Input
          value={replyBody}
          disabled={isPending || myIndex === null}
          onChange={(e) => setReplyBody(e.target.value)}
          placeholder={
            myIndex === null
              ? "System Locked: Certified signature index mismatch."
              : "Type secure message copy..."
          }
          className="flex-1 rounded-xl border bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
          onKeyDown={(e) => {
            if (e.key === "Enter" && replyBody.trim() && !isPending)
              handleSend()
          }}
        />
        <Button
          onClick={handleSend}
          disabled={!replyBody.trim() || isPending || myIndex === null}
          className="shrink-0 rounded-xl px-4"
        >
          {isPending ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <PaperPlaneTilt size={20} weight="bold" />
          )}
        </Button>
      </div>
    </div>
  )
}
