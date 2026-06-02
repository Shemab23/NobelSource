import {
  ArrowRightIcon,
  CheckCircleIcon,
  UsersIcon,
  MapPinIcon,
  ImageSquareIcon,
  InfoIcon,
} from "@phosphor-icons/react"
import { motion, type Variants } from "framer-motion"

// Using shared types
type Content = {
  title: string
  body: string
  media: string[]
  category?: string
  type: "OFFER" | "WANT" | "INFO"
  price: number
  unit: "kg" | "ton" | "unit" | "letter" | "item" | "hour" | "day"
  currency: string
  location: string
}

interface PostDetail {
  id: string
  content: Content
  owner: string[]
}

const CURRENCY_RATES: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.79 }

export function MarketCard({
  post,
  prefCurrency,
  onClick,
  variants,
}: {
  post: PostDetail
  prefCurrency: string
  onClick: (p: PostDetail) => void
  variants: Variants
}) {
  const convertedPrice = (
    (post.content.price || 0) * (CURRENCY_RATES[prefCurrency] || 1)
  ).toLocaleString()

  // 1. Determine Badge Color
  const badgeStyles = {
    WANT: "bg-orange-500/90 text-white",
    OFFER: "bg-emerald-600/90 text-white",
    INFO: "bg-blue-500/90 text-white",
  }

  return (
    <motion.div
      variants={variants}
      layoutId={post.id}
      onClick={() => onClick(post)}
      className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-all hover:border-primary/40 hover:shadow-lg"
    >
      {/* MEDIA SECTION */}
      <div className="relative h-44 w-full overflow-hidden bg-muted/30">
        <div className="absolute top-3 left-3 z-10">
          <span
            className={`rounded-md px-2 py-0.5 text-[10px] font-black tracking-tighter uppercase shadow-sm backdrop-blur-md ${badgeStyles[post.content.type]}`}
          >
            {post.content.type}
          </span>
        </div>

        {/* 2. IMAGE FALLBACK LOGIC: Checks if media array exists and has length */}
        {post.content.media && post.content.media.length > 0 ? (
          <img
            src={post.content.media[0]}
            alt={post.content.title}
            className="h-full w-full object-cover grayscale-[0.2] transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted/50 to-muted/20 opacity-40">
            {post.content.type === "INFO" ? (
              <InfoIcon size={48} weight="thin" />
            ) : (
              <ImageSquareIcon size={48} weight="thin" />
            )}
            <span className="text-[10px] font-bold tracking-widest uppercase">
              Media Pending
            </span>
          </div>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          <UsersIcon weight="fill" className="text-primary/60" />
          <span className="max-w-[120px] truncate">
            {post.owner[0] || "Auth. Agent"}
          </span>
          {post.owner.length > 1 && (
            <span className="text-primary">+{post.owner.length - 1}</span>
          )}
          <CheckCircleIcon
            size={12}
            weight="fill"
            className="ml-auto text-primary/40"
          />
        </div>

        <h3 className="mb-1 line-clamp-1 text-sm font-black tracking-tight text-foreground uppercase transition-colors group-hover:text-primary">
          {post.content.title}
        </h3>
        <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground/80 italic">
          {post.content.body}
        </p>

        {/* FOOTER */}
        <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase">
              <MapPinIcon weight="fill" className="text-primary/60" />{" "}
              {post.content.location.split("#")[0]}
            </div>

            {/* Price display with unit logic */}
            <div className="flex items-baseline gap-1 text-lg leading-tight font-black">
              {post.content.price > 0 ? (
                <>
                  {convertedPrice}
                  <span className="text-[10px] font-bold opacity-60">
                    /{post.content.unit}
                  </span>
                  <span className="ml-0.5 text-[10px] font-medium opacity-40">
                    {prefCurrency}
                  </span>
                </>
              ) : (
                <span className="text-xs tracking-tighter text-primary uppercase">
                  Information Only
                </span>
              )}
            </div>
          </div>

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/5 transition-all group-hover:bg-primary group-hover:text-white">
            <ArrowRightIcon weight="bold" size={14} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
