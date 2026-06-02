import {
  IdentificationCardIcon,
  ImageIcon,
  PhoneIcon,
  NotebookIcon,
  GlobeIcon,
  MapPinIcon,
} from "@phosphor-icons/react"
import { InputBlock } from "./ui/InputBlock"
import { useGlobalContext } from "@/utilits/Hooks/General"
import { useEffect, useState } from "react"
type props = {
  valid: (k: boolean) => void
}

export const Register_profile = ({ valid }: props) => {
  const { setRegisterData } = useGlobalContext()
  const [name, setName] = useState("")
  const [summary, setSummary] = useState("")
  const [phone, setPhone] = useState("")
  const [country, setCountry] = useState("")
  const [website, setWebsite] = useState("")
  const [image, setImage] = useState<File | undefined>(undefined)

  useEffect(() => {
    setRegisterData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        profile: {
          ...prev.metadata.profile,
          name: name + "^" + summary,
          phone,
          country,
          website,
        },
      },
      display_image: image,
    }))

    const isValid = name && image
    valid(!!isValid)
  }, [name, summary, phone, country, website, image, valid, setRegisterData])

  return (
    <>
      <InputBlock
        label="Business Name"
        icon={IdentificationCardIcon}
        value={name}
        onChange={setName}
      />
      <InputBlock
        label="Personal Summary"
        icon={NotebookIcon}
        type="textArea"
        maxLength={500}
        value={summary}
        onChange={setSummary}
      />
      <InputBlock
        label="Phone (Optional)"
        icon={PhoneIcon}
        type="tel"
        value={phone}
        onChange={setPhone}
      />
      <InputBlock
        label="Country (Optional)"
        icon={GlobeIcon}
        value={country}
        onChange={setCountry}
      />
      <InputBlock
        label="website (Optional)"
        icon={MapPinIcon}
        value={website}
        onChange={setWebsite}
      />
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-muted-foreground uppercase">
          <ImageIcon size={14} className="mr-1 inline" /> Business Avatar
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) {
              setImage(file)
            }
          }}
        />

        {image && <p className="text-[10px] font-bold">{image.name}</p>}
      </div>
    </>
  )
}
