import { useMemo } from "react"
import { motion } from "framer-motion"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import {
  UserIcon,
  ShieldCheckIcon,
  PhoneIcon,
  KeyIcon,
  StarIcon,
  SignOutIcon,
  BrowserIcon,
  EnvelopeSimpleIcon,
  Globe,
} from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GetMeOption } from "@/api/option/user"
import type { ApiPermission } from "@/api/config/types/auth"

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // Using the requested GetMeOption
  const { data, isLoading, isError } = useQuery(GetMeOption())

  // Extracting 'user' from the response structure
  const user = data?.ans

  const handleLogout = () => {
    queryClient.clear()
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    navigate("/login")
  }

  // Parse Name Format: Title_Name^Summary
  const profile = useMemo(() => {
    if (!user?.metadata?.profile?.name)
      return { title: "Member", name: "User", summary: "" }

    const [titleName, summary] = user.metadata.profile.name.split("^")
    const [title, name] = titleName.split("_")

    return {
      title: title || "User",
      name: name || titleName,
      summary: summary || "",
    }
  }, [user])

  if (isLoading)
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-[10px] font-black tracking-widest uppercase opacity-40">
          Decrypting Profile...
        </p>
      </div>
    )

  if (isError || !user)
    return (
      <div className="p-20 text-center font-bold tracking-tighter text-red-500">
        SECURE SESSION FAILED. PLEASE RE-AUTHENTICATE.
      </div>
    )
  return (
    <div className="mx-auto min-h-screen max-w-7xl bg-background p-4 font-sans text-foreground sm:p-8 lg:p-14">
      {/* HEADER SECTION */}
      <header className="mb-14 flex flex-col justify-between gap-6 border-b pb-12 md:flex-row md:items-end">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter sm:text-7xl">
            SETTINGS
          </h1>
          <div className="flex items-center gap-4">
            <Badge
              variant="secondary"
              className="px-3 py-1 font-mono text-[11px] tracking-widest uppercase"
            >
              REG: {user?.registration_number}
            </Badge>
            <span className="text-[11px] font-bold text-muted-foreground uppercase opacity-40">
              Synced: {new Date(user?.updated_at || "").toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="h-16 gap-3 rounded-2xl border-red-500/20 bg-red-500/5 px-10 font-black text-red-500 shadow-xl transition-all hover:bg-red-500 hover:text-white active:scale-95"
        >
          <SignOutIcon size={24} weight="bold" /> LOGOUT SESSION
        </Button>
      </header>

      <div className="grid gap-16 lg:grid-cols-12">
        {/* SIDEBAR: IDENTITY CARD */}
        <aside className="space-y-10 lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <img
              src={user?.metadata?.profile?.image}
              alt="Profile"
              className="aspect-square w-full rounded-[3.5rem] object-cover shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-border"
            />
            {/* Reputation Badge */}
            <div className="absolute -right-6 -bottom-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-primary text-primary-foreground shadow-2xl">
              <StarIcon weight="fill" size={40} />
              <span className="absolute -top-2 -left-2 rounded-full bg-black px-2.5 py-1 text-xs font-black ring-4 ring-background">
                {user?.metadata?.rating}
              </span>
            </div>
          </motion.div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Badge className="border-none bg-primary/10 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-primary uppercase hover:bg-primary/20">
                {profile.title}
              </Badge>
              <h2 className="text-5xl leading-none font-black tracking-tighter text-balance">
                {profile.name}
              </h2>
            </div>
            <p className="border-l-4 border-primary/20 pl-6 text-lg leading-relaxed font-medium text-muted-foreground italic">
              {profile.summary}
            </p>
          </div>
        </aside>

        {/* MAIN: DATA SECTIONS */}
        <main className="space-y-12 lg:col-span-8">
          {/* PROFILE FIELDS */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-primary/10 p-3">
                <UserIcon size={28} weight="bold" className="text-primary" />
              </div>
              <h3 className="text-2xl font-black tracking-tight uppercase">
                Core Metadata
              </h3>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {[
                {
                  label: "Email Address",
                  val: user?.email,
                  icon: <EnvelopeSimpleIcon size={18} />,
                },
                {
                  label: "Phone Connection",
                  val: user?.metadata?.profile?.phone,
                  icon: <PhoneIcon size={18} />,
                },
                {
                  label: "Operation Region",
                  val: `${user?.metadata?.profile?.country} (${user?.metadata?.profile?.currency})`,
                  icon: <Globe size={18} />,
                },
                {
                  label: "Global Portal",
                  val: user?.metadata?.profile?.website,
                  icon: <BrowserIcon size={18} />,
                  link: true,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-3xl border bg-muted/20 p-8 shadow-sm transition-all hover:bg-muted/40 hover:shadow-md"
                >
                  <span className="mb-3 flex items-center gap-3 text-xs font-black tracking-widest uppercase opacity-40">
                    {item.icon} {item.label}
                  </span>
                  <p
                    className={`text-xl font-bold tracking-tight ${item.link ? "text-primary underline decoration-primary/30 underline-offset-8" : ""}`}
                  >
                    {item.val || "NOT_SET"}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* PERMISSIONS SECTION */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-green-500/10 p-3">
                <ShieldCheckIcon
                  size={28}
                  weight="bold"
                  className="text-green-500"
                />
              </div>
              <h3 className="text-2xl font-black tracking-tight uppercase">
                Verified Authorizations
              </h3>
            </div>

            <div className="grid gap-4">
              {user?.metadata?.permissions?.map(
                (p: ApiPermission, i: number) => (
                  <div
                    key={i}
                    className="flex flex-col items-start justify-between rounded-3xl border bg-card p-8 shadow-sm transition-all hover:border-green-500/30 sm:flex-row sm:items-center"
                  >
                    <div className="mb-4 flex items-center gap-6 sm:mb-0">
                      <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                      <div>
                        <p className="text-lg font-black tracking-tighter uppercase">
                          {p.right} Access Grant
                        </p>
                        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-60">
                          Verified via {p.document} • Issued by {p.by}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-green-500/40 bg-green-500/5 px-4 py-2 text-xs font-black tracking-tighter text-green-600 uppercase"
                    >
                      {p.status}
                    </Badge>
                  </div>
                )
              )}
            </div>
          </section>

          {/* SECURITY FOOTER */}
          <section className="rounded-[2.5rem] border border-orange-500/20 bg-card p-10 shadow-lg">
            <div className="mb-6 flex items-center gap-6">
              <KeyIcon size={36} weight="bold" className="text-orange-500" />
              <div>
                <h3 className="text-2xl font-black tracking-tighter uppercase">
                  Security Protocol
                </h3>
                <p className="text-xs font-bold text-muted-foreground uppercase opacity-50">
                  Role-Based Access Control
                </p>
              </div>
            </div>
            <p className="mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Your credentials are secured with PBKDF2/Salted hash encryption.
              Digital rights and limits are strictly audited based on the{" "}
              <strong>{user?.role}</strong> role assigned to this terminal.
            </p>
            <Button
              variant="secondary"
              className="h-14 w-full rounded-2xl px-12 text-xs font-black tracking-[0.2em] uppercase shadow-md transition-all active:scale-95 sm:w-auto"
            >
              ROTATE ACCESS CREDENTIALS
            </Button>
          </section>
        </main>
      </div>
    </div>
  )
}
