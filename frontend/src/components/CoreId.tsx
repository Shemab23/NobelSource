import {
  BriefcaseIcon,
  EnvelopeSimpleIcon,
  IdentificationCardIcon,
} from "@phosphor-icons/react"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { GlobeIcon, LinkIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"

type Profile = {
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

export const CoreId = (profile: Profile) => {
  return (
    <div className="space-y-12 lg:col-span-8">
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <IdentificationCardIcon size={24} className="text-primary" />
          <h2 className="text-xs font-black tracking-[0.2em] uppercase">
            Core Identity
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black text-muted-foreground uppercase">
              Legal Name
            </label>
            <Input
              value={profile.legal_name}
              className="h-12 rounded-2xl border-none bg-muted/50 px-5 text-sm font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black text-muted-foreground uppercase">
              Entity Display Name
            </label>
            <Input
              value={profile.display_name}
              className="h-12 rounded-2xl border-none bg-muted/50 px-5 text-sm font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black text-muted-foreground uppercase">
              Public Email
            </label>
            <Input
              value={profile.email}
              readOnly
              className="h-12 cursor-not-allowed rounded-2xl border-none bg-muted/20 px-5 text-sm text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-[10px] font-black text-muted-foreground uppercase">
              Professional Title
            </label>
            <Input
              value={profile.job_title}
              className="h-12 rounded-2xl border-none bg-muted/50 px-5 text-sm font-bold"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="ml-1 text-[10px] font-black text-muted-foreground uppercase">
            Entity Biography
          </label>
          <Textarea
            value={profile.bio}
            className="min-h-30 rounded-2xl border-none bg-muted/50 p-5 text-sm leading-relaxed"
          />
        </div>
      </section>

      {/* INDUSTRY SECTORS */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <BriefcaseIcon size={24} className="text-primary" />
          <h2 className="text-xs font-black tracking-[0.2em] uppercase">
            Business Sectors
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.industry_tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="rounded-xl px-4 py-2 text-[10px] font-bold tracking-tighter uppercase"
            >
              {tag.replace("_", " ")}
            </Badge>
          ))}
          <Button
            variant="ghost"
            className="h-8 rounded-xl border border-dashed border-muted-foreground/30 text-[9px] font-black uppercase"
          >
            + Add Tag
          </Button>
        </div>
      </section>

      {/* SOCIAL LINKS */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <LinkIcon size={24} className="text-primary" />
          <h2 className="text-xs font-black tracking-[0.2em] uppercase">
            External Verifiers
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl bg-muted/30 p-4">
            <GlobeIcon size={20} className="text-muted-foreground" />
            <Input
              placeholder="website.com"
              className="h-6 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center gap-4 rounded-2xl bg-muted/30 p-4">
            <EnvelopeSimpleIcon size={20} className="text-muted-foreground" />
            <Input
              placeholder="@handle"
              className="h-6 border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
