import { CloudArrowUpIcon } from "@phosphor-icons/react"
import type { FC } from "react"

interface FileUploadProps {
  onUpload: (data: string, name: string) => void
  fileName?: string
  label?: string
  compact?: boolean
}

export const FileUpload: FC<FileUploadProps> = ({
  onUpload,
  fileName,
  label = "Upload Document",
  compact = false,
}) => (
  <div
    className={`group relative flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed transition-all hover:bg-primary/5 ${compact ? "h-14" : "h-24"}`}
  >
    <input
      type="file"
      className="absolute inset-0 cursor-pointer opacity-0"
      onChange={(e) => {
        const file = e.target.files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onloadend = () => onUpload(reader.result as string, file.name)
          reader.readAsDataURL(file)
        }
      }}
    />
    <div className="px-4 text-center">
      {!compact && (
        <CloudArrowUpIcon
          size={20}
          className="mx-auto mb-1 text-muted-foreground group-hover:text-primary"
        />
      )}
      <p className="max-w-50 truncate text-[10px] font-bold">
        {fileName || label}
      </p>
    </div>
  </div>
)
