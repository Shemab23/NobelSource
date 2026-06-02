import { CameraIcon, UserIcon } from "@phosphor-icons/react"
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

type Props = {
  handleClick: (
    event: string,
    data: {
      field: string
      value: string
    } | null
  ) => void
  profile: User
}

export const Avatar = ({ handleClick, profile }: Props) => {
  return (
    <div className="group relative mx-auto aspect-square w-full max-w-75 lg:mx-0">
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[3rem] border-2 border-dashed border-muted bg-muted/20 transition-all group-hover:bg-muted/30">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <UserIcon
            size={64}
            weight="thin"
            className="text-muted-foreground opacity-40"
          />
        )}
      </div>
      <button
        className="absolute -right-2 -bottom-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-110 active:scale-95"
        onClick={() => handleClick("avatar", null)}
      >
        <CameraIcon size={24} weight="fill" />
      </button>
    </div>
  )
}
