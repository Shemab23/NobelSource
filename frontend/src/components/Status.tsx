import { FingerprintIcon } from "@phosphor-icons/react"
import { Badge } from "./ui/badge"

type User = {
  legal_name: string
  display_name: string
  email: string
  bio: string
  job_title: string
  industry_tags: string[]
  verification_status: string
  trust_score: number
  avatar_url: string | null
}

export const Status = (profile: User) => {
  return (
    <div className="space-y-4 rounded-4xl border bg-card/50 p-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">
          Status
        </h3>
        <Badge className="border-none bg-green-500/10 px-3 text-[9px] font-black text-green-500 uppercase">
          {profile.verification_status}
        </Badge>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <FingerprintIcon size={24} className="text-primary" />
        </div>
        <div>
          <p className="text-[10px] font-black text-muted-foreground uppercase">
            Trust Score
          </p>
          <p className="text-xl font-black italic">
            {profile.trust_score}
            <span className="text-xs opacity-30">/100</span>
          </p>
        </div>
      </div>
    </div>
  )
}
