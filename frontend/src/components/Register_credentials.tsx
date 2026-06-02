import { EnvelopeIcon, LockIcon } from "@phosphor-icons/react"
import { InputBlock } from "./ui/InputBlock"
import { useGlobalContext } from "@/utilits/Hooks/General"
import { useEffect, useState } from "react"

type Props = {
  valid: (k: boolean) => void
}

export const Register_credentials = ({ valid }: Props) => {
  const { registerData, setRegisterData } = useGlobalContext()

  // Initialize state from existing global context to prevent overwriting with empty strings
  const [email, setEmail] = useState(registerData?.email || "")
  const [password, setPassword] = useState(registerData?.password || "")
  const [confirm_password, setConfirmPassword] = useState(
    registerData?.password || ""
  )

  const passMismatch = password !== confirm_password

  useEffect(() => {
    // 1. Update Global State
    setRegisterData((prev) => ({
      ...prev,
      email,
      password,
    }))

    // 2. Validate and notify parent
    // Ensure all fields are filled AND passwords match
    const isValid =
      email.length > 0 &&
      password.length > 0 &&
      confirm_password.length > 0 &&
      !passMismatch
    valid(isValid)
  }, [email, password, confirm_password, passMismatch, valid, setRegisterData])

  return (
    <div className="space-y-4">
      <InputBlock
        label="Email"
        icon={EnvelopeIcon}
        type="email"
        value={email}
        placeholder="email@here"
        onChange={setEmail}
      />
      <InputBlock
        label="Password"
        icon={LockIcon}
        type="password"
        value={password}
        placeholder="***************"
        onChange={setPassword}
      />
      <InputBlock
        label="Confirm Password"
        icon={LockIcon}
        type="password"
        value={confirm_password}
        placeholder="***************"
        onChange={setConfirmPassword}
        // Only show error if the user has actually typed something in confirm_password
        error={confirm_password.length > 0 && passMismatch}
        errorMessage="Passwords do not match!"
      />
    </div>
  )
}
