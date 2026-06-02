import type { FC } from "react"

interface InputBlockProps {
  label: string
  icon: React.ElementType
  value: string
  onChange: (val: string) => void
  type?: string
  error?: boolean
  errorMessage?: string
  placeholder?: string
  maxLength?: number
}

export const InputBlock: FC<InputBlockProps> = ({
  label,
  icon: Icon,
  value,
  onChange,
  maxLength = 100,
  type = "text",
  error = false,
  errorMessage = "",
  placeholder = "",
}) => {
  // Determine if we should use a textarea or a standard input
  const isTextArea = type === "textArea"
  const Component = isTextArea ? "textarea" : "input"

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
        <Icon size={14} /> {label}
      </label>

      <Component
        type={!isTextArea ? type : undefined}
        maxLength={maxLength}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-xl border bg-card px-4 py-3 transition-all outline-none ${
          isTextArea ? "min-h-30 resize-y" : "h-12"
        } ${
          error
            ? "border-red-500 ring-red-500/10 focus:ring-4"
            : "focus:ring-2 focus:ring-primary/20"
        }`}
      />

      <div className="flex items-center justify-between">
        {error && (
          <p className="text-[10px] font-bold text-red-500">{errorMessage}</p>
        )}
        {/* Added a character counter for better UX on long summaries */}
        <p className="ml-auto text-[9px] font-medium text-muted-foreground">
          {value?.length || 0} / {maxLength}
        </p>
      </div>
    </div>
  )
}
