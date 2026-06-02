import {
  CheckCircleIcon,
  ImageSquareIcon,
  XIcon,
  UsersIcon,
  MapPinIcon,
  ArrowSquareOutIcon,
  ShieldCheckIcon,
  PaperPlaneTiltIcon,
  InfoIcon,
} from "@phosphor-icons/react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Button } from "./ui/button"
import { useTheme } from "./theme-provider"
import { fadeIn } from "@/utilits/animations"
import type { message_flag_enum } from "@/types/general"
import { CreateMessageOption } from "@/api/option/messag"
import { useMutation } from "@tanstack/react-query"

type Content = {
  title: string
  body: string
  description?: string
  media: string[]
  category?: string
  type: "OFFER" | "WANT" | "INFO"
  price: number
  unit: string
  currency: string
  location: string
}

interface PostDetail {
  id: string
  content: Content
  owner: string[]
}

const CURRENCY_RATES: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79 }

function DealOverlay({
  isOpen,
  onClose,
  post,
  theme,
}: {
  isOpen: boolean
  onClose: () => void
  post: PostDetail
  theme: string | undefined
}) {
  const recipientId = post.owner[0] || ""

  const [message, setMessage] = useState(
    `I am interested in "${post.content.title}". Please provide further details on terms and availability.`
  )
  const [roomId, setRoomId] = useState("")
  const [messageFlag, setMessageFlag] = useState<
    "chat" | "system" | "notification" | "proposal" | "dispute"
  >("proposal")

  // Initialize the mutation
  const { mutate: sendMessage, isPending } = useMutation(CreateMessageOption())

  const handleSend = () => {
    const payload = {
      to_id: recipientId,
      room_id: roomId || null,
      body: message,
      message_flag: messageFlag,
    }

    sendMessage(payload, {
      onSuccess: () => {
        alert("Message sent successfully.")
        onClose()
      },
      onError: (error) => {
        console.error("Failed to send message:", error)
        alert("Failed to send proposal. Please try again.")
      },
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-70 flex justify-end">
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`relative flex h-full w-full max-w-md flex-col border-l p-8 shadow-2xl ${
              theme === "dark"
                ? "border-white/10 bg-card"
                : "border-black/5 bg-white"
            }`}
          >
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tighter uppercase">
                Initiate Deal
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-2 transition-colors hover:bg-muted"
              >
                <XIcon size={24} />
              </button>
            </div>

            <div className="flex flex-1 flex-col space-y-6">
              {/* Target Asset Display */}
              <div>
                <label className="text-[10px] font-black tracking-widest text-primary uppercase">
                  Target Asset
                </label>
                <p className="text-sm font-bold">{post.content.title}</p>
                <p className="text-[10px] text-muted-foreground">
                  Recipient ID: {recipientId}
                </p>
              </div>

              {/* Room ID Input */}
              <div>
                <label className="text-[10px] font-black tracking-widest text-primary uppercase">
                  Room ID (Optional)
                </label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter existing room ID..."
                  className="mt-2 w-full rounded-xl border bg-muted/30 p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Message Flag Selector */}
              <div>
                <label className="text-[10px] font-black tracking-widest text-primary uppercase">
                  Message Priority
                </label>
                <select
                  value={messageFlag}
                  onChange={(e) =>
                    setMessageFlag(e.target.value as message_flag_enum)
                  }
                  className="mt-2 w-full rounded-xl border bg-muted/30 p-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="inquiry">General Inquiry</option>
                  <option value="urgent">Urgent</option>
                  <option value="system">System Notice</option>
                </select>
              </div>

              {/* Proposal Message */}
              <div className="flex-1">
                <label className="text-[10px] font-black tracking-widest text-primary uppercase">
                  Proposal Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-2 h-48 w-full resize-none rounded-2xl border bg-muted/30 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <Button
                onClick={handleSend}
                disabled={isPending}
                className="h-16 w-full gap-2 rounded-2xl text-sm font-black tracking-widest uppercase shadow-xl shadow-primary/20"
              >
                {isPending ? (
                  "Sending..."
                ) : (
                  <>
                    <PaperPlaneTiltIcon size={20} weight="bold" />
                    Send Proposal
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// --- Main Post Overlay ---
export function PostOverlay({
  id,
  post,
  prefCurrency,
  onClose,
}: {
  id: string
  post: PostDetail
  prefCurrency: string
  onClose: () => void
}) {
  const [activeImg, setActiveImg] = useState(0)
  const [isDealOpen, setIsDealOpen] = useState(false)
  const { theme } = useTheme()

  const convertedPrice = (
    (post.content.price || 0) * (CURRENCY_RATES[prefCurrency] || 1)
  ).toLocaleString()
  const [locationName, mapUrl] = post.content.location.split("#")

  return (
    <>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-0 text-foreground md:p-6 lg:p-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={`absolute inset-0 backdrop-blur-2xl ${theme === "dark" ? "bg-black/70" : "bg-white/50"}`}
        />

        <motion.div
          layoutId={id}
          className="relative flex h-full max-h-[850px] w-full max-w-7xl flex-col overflow-hidden border border-white/10 bg-card shadow-2xl md:flex-row md:rounded-[2.5rem]"
        >
          <button
            onClick={onClose}
            className="hover:bg-destructive absolute top-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-background/80 shadow-xl backdrop-blur-md transition-all hover:scale-110 hover:text-white"
          >
            <XIcon size={24} weight="bold" />
          </button>

          {/* Left Column: Media */}
          <div className="relative flex w-full flex-col bg-muted/20 md:w-[55%]">
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImg}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="h-full w-full"
                >
                  {post.content.media && post.content.media.length > 0 ? (
                    <img
                      src={post.content.media[activeImg]}
                      className="h-full w-full object-cover"
                      alt={post.content.title}
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center bg-muted/50 text-muted-foreground/30">
                      {post.content.type === "INFO" ? (
                        <InfoIcon size={120} weight="thin" />
                      ) : (
                        <ImageSquareIcon size={120} weight="thin" />
                      )}
                      <span className="mt-4 text-xs font-black tracking-widest uppercase">
                        Media Pending
                      </span>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 flex gap-3">
                <span
                  className={`rounded-xl px-5 py-2.5 text-xs font-black tracking-widest uppercase shadow-2xl ${post.content.type === "OFFER" ? "bg-emerald-500 text-white" : "bg-blue-600 text-white"}`}
                >
                  {post.content.type}
                </span>
                <div className="rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-md">
                  REF: {id.split("-").pop()?.toUpperCase()}
                </div>
              </div>
            </div>

            {post.content.media?.length > 1 && (
              <div className="absolute right-10 bottom-10 flex gap-3">
                {post.content.media.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${activeImg === i ? "w-12 bg-white" : "w-6 bg-white/30 hover:bg-white/60"}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information */}
          <div className="flex w-full flex-col overflow-y-auto bg-card p-10 md:w-[45%] lg:p-14">
            <div className="mb-10 space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <UsersIcon size={28} weight="duotone" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground uppercase">
                    Authorized Members
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-tight font-black text-foreground uppercase">
                    {post.owner.map((name, i) => (
                      <span key={i} className="flex items-center gap-2">
                        {name.split("_")[1].split("^")[0]}
                        {i < post.owner.length - 1 && (
                          <span className="text-primary/30">•</span>
                        )}
                      </span>
                    ))}
                    <CheckCircleIcon
                      weight="fill"
                      className="ml-1 text-primary"
                      size={18}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl leading-[0.9] font-black tracking-tighter uppercase lg:text-5xl">
                  {post.content.title}
                </h2>
                <div className="rounded-2xl border-l-4 border-primary bg-primary/5 p-6 text-lg leading-snug font-bold text-foreground italic">
                  "{post.content.body}"
                </div>
                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-primary uppercase">
                    <ShieldCheckIcon size={18} weight="bold" /> Market
                    Specifications
                  </div>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {post.content.description ||
                      "Verification complete. Requesting entity has provided full documentation."}
                  </p>
                </div>
              </div>
            </div>

            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mb-10 flex items-center justify-between rounded-2xl border border-border bg-muted/30 p-5 transition-all hover:border-primary/50 hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-background p-2 text-primary shadow-sm">
                  <MapPinIcon size={20} weight="fill" />
                </div>
                <span className="text-sm font-black tracking-tight uppercase">
                  {locationName}
                </span>
              </div>
              <ArrowSquareOutIcon
                size={20}
                className="opacity-20 transition-opacity group-hover:opacity-100"
              />
            </a>

            <div className="mt-auto border-t border-border pt-10">
              <div className="mb-8 flex items-end justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">
                    Valuation
                  </span>
                  <div className="flex items-baseline gap-2 text-4xl font-black tracking-tighter">
                    {post.content.price > 0 ? (
                      <>
                        {convertedPrice}
                        <span className="text-lg font-bold text-muted-foreground uppercase">
                          {prefCurrency}
                        </span>
                        <span className="ml-1 text-xs opacity-40">
                          /{post.content.unit}
                        </span>
                      </>
                    ) : (
                      "INFORMATION ONLY"
                    )}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setIsDealOpen(true)}
                className="h-20 w-full rounded-2xl text-xl font-black tracking-[0.1em] uppercase shadow-[0_20px_50px_-10px_rgba(var(--primary-rgb),0.4)] transition-transform active:scale-95"
              >
                Initiate Deal
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <DealOverlay
        isOpen={isDealOpen}
        onClose={() => setIsDealOpen(false)}
        post={post}
        theme={theme}
      />
    </>
  )
}
