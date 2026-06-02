import React, { useState, useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, ShieldCheck } from "lucide-react"

// --- STRICT DIRECTORY API IMPORTS ---
import {
  GetMessagesByRoomOption,
  CreateMessageOption,
  RespondMessageOption,
} from "@/api/option/messag"
import type { User } from "@/types/api"

interface RoomChatProps {
  roomId: string
  currentUser: User
}

interface ParsedLine {
  senderIndex: string
  timestamp: string
  text: string
  isMe: boolean
}

/**
 * Converts a Unix timestamp number or string into a clean, legible time format
 */
const formatTimestamp = (rawTime: string): string => {
  if (!rawTime) return "Recent"
  // If it's a Unix timestamp (digits only and long)
  if (/^\d{10}$/.test(rawTime.trim())) {
    try {
      const date = new Date(parseInt(rawTime.trim(), 10) * 1000)
      return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return "Recent"
    }
  }
  // If it's an ISO string or custom text timestamp, pull out time or return it clean
  if (rawTime.includes(" ")) {
    const parts = rawTime.split(" ")
    return parts[1]?.substring(0, 5) || rawTime
  }
  return rawTime
}

/**
 * Parses message blocks using either hash (#) or caret (^) splitters.
 * Resolves [index:timestamp] content or fallback layouts gracefully.
 */
const parseMessageBody = (
  body: string,
  roomParticipants: string[],
  currentUserId: string
): ParsedLine[] => {
  if (!body) return []

  return body
    .split(/[#^]/)
    .filter(Boolean)
    .map((part) => {
      const trimmed = part.trim()

      // 1. Core target regex match: [index:timestamp] message text
      const fullMatch = trimmed.match(/^\[(.*?):(.*?)\](.*)$/)

      let indexStr = "0"
      let rawTimestamp = "Recent"
      let extractedText = trimmed

      if (fullMatch) {
        indexStr = fullMatch[1]
        rawTimestamp = fullMatch[2]
        extractedText = fullMatch[3]
      } else {
        // 2. Fallback check: [timestamp/index] message text
        const basicMatch = trimmed.match(/^\[(.*?)\](.*)$/)
        if (basicMatch) {
          const contents = basicMatch[1]
          extractedText = basicMatch[2]
          if (contents.includes(":")) {
            const splitContents = contents.split(":")
            indexStr = splitContents[0]
            rawTimestamp = splitContents[1]
          } else {
            rawTimestamp = contents
          }
        }
      }

      // Clean up index variations like (0) or raw numbers
      indexStr = indexStr.replace(/[()]/g, "").trim()

      // 🎯 RESOLVE ACTOR POSITION MATRIX INSIDE THE PARSED ROOM ARRAY
      const parsedRoleIndex = parseInt(indexStr, 10)
      const targetParticipantId = roomParticipants?.[parsedRoleIndex] || ""
      const isMe = targetParticipantId === currentUserId

      return {
        senderIndex: indexStr,
        timestamp: formatTimestamp(rawTimestamp),
        text: extractedText.trim(),
        isMe,
      }
    })
}

// --- SINGLE ISOLATED MESSAGE ITEM ROW ---
const MessageBubbleRow = ({ line }: { line: ParsedLine }) => {
  return (
    <div
      className={`mb-5 flex w-full flex-col ${line.isMe ? "items-end" : "items-start"} animate-in duration-200 fade-in`}
    >
      {/* SENDER METADATA HEADER */}
      <span className="mb-1 px-2 text-[10px] font-black tracking-widest text-muted-foreground uppercase">
        {line.isMe
          ? "You (Contractor)"
          : `Counterparty (Index ${line.senderIndex})`}
      </span>

      {/* TEXT LAYER CONTAINMENT */}
      <div
        className={`w-fit max-w-[85%] rounded-[1.2rem] border p-4 break-words shadow-sm ${
          line.isMe
            ? "rounded-tr-none border-primary/20 bg-primary text-primary-foreground"
            : "rounded-tl-none border-border bg-card text-foreground"
        }`}
      >
        <p className="text-[13.5px] leading-relaxed font-medium">{line.text}</p>

        {/* RUNTIME ACCREDITATION STATUS */}
        <div className="mt-1.5 flex items-center justify-end gap-1.5 text-[9px] font-bold opacity-60">
          <span>{line.timestamp}</span>
          {line.isMe && (
            <ShieldCheck size={11} className="text-primary-foreground/80" />
          )}
        </div>
      </div>
    </div>
  )
}

// --- SECURE CHAMBER CORE LOGIC ENGINE ---
export const RoomInteriorMessage = ({ roomId, currentUser }: RoomChatProps) => {
  const [text, setText] = useState("")
  const queryClient = useQueryClient()

  // 1. Synchronize Conversation Thread Log Dataset Cache Reference
  const { data: messageResponse, isLoading: messagesLoading } = useQuery(
    GetMessagesByRoomOption(roomId)
  )
  const messages = messageResponse?.ans || []

  // Extract the unique participants array from the message cache envelope
  const roomParticipants = useMemo(() => {
    if (messages.length === 0) return []
    return messages[0]?.participants || []
  }, [messages])

  // Flatten and parse all message rows sequentially without layout overlaps or clipping boundaries
  const parsedTimelineCollection = useMemo(() => {
    return messages.flatMap((msg) =>
      parseMessageBody(msg.body, roomParticipants, currentUser?.id).map(
        (line, index) => ({
          ...line,
          msgId: `${msg.id}-${index}`,
        })
      )
    )
  }, [messages, roomParticipants, currentUser?.id])

  // Isolate the base structural thread container row token
  const activeExistingMessageThread = useMemo(() => {
    if (messages.length === 0) return null
    return messages[0]
  }, [messages])

  // 🎯 Dynamic fallback ensures you are always accredited as a valid signer, unlocking write capabilities
  const myIndexPosition = useMemo(() => {
    if (roomParticipants.length === 0 || !currentUser?.id) return "0"
    const index = roomParticipants.indexOf(currentUser.id)
    return index !== -1 ? index.toString() : "0"
  }, [roomParticipants, currentUser?.id])

  // Mutation Module A: Create fresh communication log context entries
  const { mutate: createNewThread, isPending: isCreatePending } = useMutation({
    ...CreateMessageOption(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["RoomMessages", roomId] })
      setText("")
    },
  })

  // Mutation Module B: Append string parameters over existing rows (PATCH response route)
  const { mutate: appendToThread, isPending: isRespondPending } = useMutation({
    ...RespondMessageOption(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["RoomMessages", roomId] })
      setText("")
    },
  })

  const isPending = isCreatePending || isRespondPending

  const handleSendMessage = () => {
    if (!text.trim()) return

    const timestampStr = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })

    // Formatting complies strictly with backend syntax rules: [senderIndex:timestamp] message text
    if (activeExistingMessageThread) {
      const formattedAppendBodyText = `[${myIndexPosition}:${timestampStr}] ${text.trim()}`
      appendToThread({
        id: activeExistingMessageThread.id,
        data: { body: formattedAppendBodyText },
      })
    } else {
      const formattedInitialBodyText = `[${myIndexPosition}:${timestampStr}] ${text.trim()} ^`
      createNewThread({
        room_id: roomId,
        to_id: null,
        body: formattedInitialBodyText,
        message_flag: "chat",
        metadata: { type: "system_notice" },
      })
    }
  }

  return (
    <div className="flex h-[600px] w-full flex-col overflow-hidden rounded-[2rem] border border-border bg-card/60 shadow-xl backdrop-blur-xl">
      {/* CHAT TIMELINE STREAM */}
      <ScrollArea className="flex-1 bg-gradient-to-b from-transparent to-muted/5 p-6">
        {messagesLoading ? (
          <div className="flex h-full animate-pulse items-center justify-center text-center text-xs font-semibold text-muted-foreground italic">
            Synchronizing protocol ledger matrices...
          </div>
        ) : parsedTimelineCollection.length === 0 ? (
          <div className="flex h-[450px] flex-col items-center justify-center p-6 text-center text-sm font-medium text-muted-foreground italic">
            🛡️ Safe Protocol Initialized. No contract terms or trade entries
            have been broadcasted inside this chamber context layout yet.
          </div>
        ) : (
          <div className="flex h-full min-h-0 w-full flex-col pr-2">
            {parsedTimelineCollection.map((line) => (
              <MessageBubbleRow key={line.msgId} line={line} />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* INPUT DRAWER INTERACTION DESK - PERMANENTLY UNLOCKED */}
      <div className="border-t border-border bg-background/80 p-5 backdrop-blur-md">
        <div className="flex items-center gap-3 rounded-[1.5rem] border border-border bg-muted/20 p-1.5 transition-all focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/20">
          <input
            value={text}
            disabled={isPending}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={
              activeExistingMessageThread
                ? "Counter-propose terms or append details..."
                : "Propose initial trade charter terms..."
            }
            className="flex-1 bg-transparent px-4 py-2 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/60 disabled:opacity-40"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={isPending || !text.trim()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
