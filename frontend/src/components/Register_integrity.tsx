import {
  BriefcaseIcon,
  CertificateIcon,
  PlusIcon,
  ShieldCheckIcon,
  TagChevronIcon,
  TrashIcon,
  FileSearchIcon,
  FilePdfIcon,
  FileDocIcon,
} from "@phosphor-icons/react"
import { InputBlock } from "./ui/InputBlock"
import { useGlobalContext } from "@/utilits/Hooks/General"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"

type props = {
  valid: (k: boolean) => void
}

type LocalPermission = {
  name: string
  file: File | null
}

export const Register_integrity = ({ valid }: props) => {
  const { setRegisterData } = useGlobalContext()
  const [title, setTitle] = useState("")
  const [regNumber, setRegNumber] = useState("")
  const [permissions, setPermissions] = useState<LocalPermission[]>([])
  const [name, setName] = useState("")

  useEffect(() => {
    const metadataPermissions = permissions.map((p) => ({
      right: p.name,
      status: "pending" as const,
      by: "",
      document: p.file?.name ?? "",
    }))

    setRegisterData((prev) => {
      const currentFullname = prev.metadata.profile.name

      const baseName = currentFullname.includes("_")
        ? currentFullname.split("_").pop()
        : currentFullname
      return {
        ...prev,
        registration_number: regNumber,
        metadata: {
          ...prev.metadata,
          profile: {
            ...prev.metadata.profile,
            name: title ? `${title}_${baseName}` : (baseName ?? "Unknown"),
          },
          permissions: metadataPermissions,
        },
        permission_keys: permissions.map((p) => p.name),
        permissions: permissions
          .map((p) => p.file)
          .filter((file): file is File => file != null),
      }
    })

    valid(Boolean(regNumber))
  }, [title, regNumber, permissions, valid, setRegisterData])

  const addPermission = (doc: string) => {
    setPermissions((prev) => [...prev, { name: doc, file: null }])
    setName("") // Clear input after adding
  }

  const removePermission = (index: number) => {
    setPermissions((prev) => prev.filter((_, i) => i !== index))
  }

  const updateFile = (index: number, file: File | null) => {
    setPermissions((prev) =>
      prev.map((p, i) => (i === index ? { ...p, file } : p))
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Left Side: Inputs */}
      <div className="space-y-6">
        <InputBlock
          label="Job Title"
          icon={BriefcaseIcon}
          value={title}
          onChange={setTitle}
        />
        <InputBlock
          label="Registration Number"
          icon={ShieldCheckIcon}
          value={regNumber}
          onChange={setRegNumber}
        />

        <div className="space-y-4 border-t pt-6">
          <label className="text-[10px] font-bold tracking-wider text-primary uppercase">
            Add Industry Expertise
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <InputBlock
                label="Certification Name"
                icon={CertificateIcon}
                value={name}
                onChange={setName}
              />
            </div>
            <Button
              className="mt-6"
              onClick={() =>
                name.trim() ? addPermission(name) : alert("Enter a name")
              }
            >
              <PlusIcon size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side: Upload List & Previews */}
      <div className="space-y-4 rounded-2xl border border-border bg-secondary/30 p-6">
        <h3 className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
          <FileSearchIcon size={18} /> Uploaded Documents
        </h3>

        {permissions.length === 0 && (
          <p className="text-xs text-muted-foreground italic">
            No certifications added yet.
          </p>
        )}

        <div className="space-y-3">
          {permissions.map((p, i) => (
            <div
              key={`${p.name}-${i}`}
              className="group relative rounded-xl border bg-background p-4 shadow-sm transition-all hover:border-primary/50"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold">
                  <TagChevronIcon weight="fill" className="text-primary" />{" "}
                  {p.name}
                </span>
                <button
                  onClick={() => removePermission(i)}
                  className="hover:text-destructive text-muted-foreground transition-colors"
                >
                  <TrashIcon size={18} />
                </button>
              </div>

              {/* File Input */}
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" // Expanded to documents
                className="w-full cursor-pointer text-xs file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-2 file:py-1 file:text-xs file:text-primary-foreground hover:file:bg-primary/90"
                onChange={(e) => updateFile(i, e.target.files?.[0] || null)}
              />

              {/* Document Preview Section */}
              {p.file && (
                <div className="mt-3 flex items-center gap-3 rounded-lg border bg-muted p-3">
                  {/* File Icon based on type */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                    {p.file.type.includes("pdf") ? (
                      <FilePdfIcon size={24} weight="fill" />
                    ) : (
                      <FileDocIcon size={24} weight="fill" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">
                      {p.file.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {(p.file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  {/* Action: Open/View */}
                  <a
                    href={URL.createObjectURL(p.file)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md bg-background px-2 py-1 text-[10px] font-bold shadow-sm hover:bg-accent"
                  >
                    VIEW
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
