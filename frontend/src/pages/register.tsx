import * as React from "react"
import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  CheckCircleIcon,
  WarningCircleIcon,
  CircleNotch,
} from "@phosphor-icons/react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Register_credentials } from "@/components/Register_credentials"
import { useGlobalContext } from "@/utilits/Hooks/General"
import { Register_profile } from "@/components/Register_profile"
import { Register_integrity } from "@/components/Register_integrity"
import { RegisterOption, LoginOption } from "@/api/option/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type {
  Permission,
  Register as RegisterType,
} from "@/api/config/types/auth"

interface AuditItemProps {
  label: string
  status: boolean
  sub?: string
}

const AuditItem: React.FC<AuditItemProps> = ({ label, status, sub }) => (
  <div className="group flex items-center justify-between border-b border-border/50 py-2">
    <div className="flex flex-col">
      <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
        {label}
      </span>
      <span
        className={`w-32 truncate text-xs font-medium ${status ? "text-foreground" : "text-destructive/80 italic"}`}
      >
        {sub || "Missing"}
      </span>
    </div>
    {status ? (
      <CheckCircleIcon
        size={20}
        className="shrink-0 text-green-500"
        weight="fill"
      />
    ) : (
      <WarningCircleIcon
        size={20}
        className="text-destructive/80 shrink-0"
        weight="fill"
      />
    )}
  </div>
)

export const Register: React.FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { registerData } = useGlobalContext()

  const [activeTab, setActiveTab] = useState<number>(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [tab1Valid, setTab1Valid] = useState(false)
  const [tab2Valid, setTab2Valid] = useState(false)
  const [tab3Valid, setTab3Valid] = useState(false)

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 6000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  const { mutate: loginMutate, isPending: isLoginPending } = useMutation({
    ...LoginOption(),
    onSuccess: (data) => {
      if (data?.msg === "success") {
        queryClient.invalidateQueries()
        navigate("/login")
      }
    },
    onError: (err) =>
      setErrorMessage(err?.message || "Login handshake failed."),
  })

  const { mutate: registerMutate, isPending: isRegisterPending } = useMutation({
    ...RegisterOption(),
    onSuccess: (data) => {
      if (data?.msg === "success") {
        loginMutate({
          email: registerData?.email || "",
          password: registerData?.password || "",
        })
      }
    },
    onError: (err) =>
      setErrorMessage(err?.message || "Database allocation failed."),
  })

  const isPending = isRegisterPending || isLoginPending
  const stepIsInvalid = useMemo(() => {
    if (activeTab === 0) return !tab1Valid
    if (activeTab === 1) return !tab2Valid
    if (activeTab === 2) return !tab3Valid
    return false
  }, [activeTab, tab1Valid, tab2Valid, tab3Valid])

  const encodedName = useMemo(
    () =>
      registerData?.metadata?.profile?.name?.split("^")[0]?.split("_")[1] ||
      "New Entity",
    [registerData]
  )
  const encodedTitle = useMemo(
    () => registerData?.metadata?.profile?.name?.split("_")[0] || "N/A",
    [registerData]
  )
  const encodedSummary = useMemo(
    () => registerData?.metadata?.profile?.name?.split("^")[1] || "No summary.",
    [registerData]
  )

  const handleFinalSubmit = () => {
    if (!registerData) return

    const validatedPermissions: Permission[] = (
      registerData.metadata?.permissions || []
    ).map((p) => ({
      right: p.right || "",
      status: p.status || "pending",
      by: p.by || "system",
      document: p.document || "",
    }))

    const submissionPayload: RegisterType = {
      email: registerData.email || "",
      registration_number: registerData.registration_number || "",
      password: registerData.password,
      metadata: {
        profile: {
          name: registerData.metadata?.profile?.name || "",
          phone: registerData.metadata?.profile?.phone || "",
          country: registerData.metadata?.profile?.country || "",
          website: registerData.metadata?.profile?.website || "",
          currency: registerData.metadata?.profile?.currency || "RWF",
        },
        permissions: validatedPermissions,
      },
      permission_keys: registerData.permission_keys,
      display_image: registerData.display_image ?? undefined,
    }

    registerMutate(submissionPayload)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background p-6 md:p-12">
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-6 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4"
          >
            <Alert variant="destructive">
              <AlertTitle>Exception</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="mx-auto mb-10 w-full max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-black uppercase italic">NOBEL SOURCE</h1>
          <Button variant="destructive" onClick={() => navigate("/Login")}>
            Cancel
          </Button>
        </div>
        <div className="flex w-full max-w-md gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${activeTab >= i ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 md:flex-row">
        <div className="flex-1">
          {activeTab === 0 && <Register_credentials valid={setTab1Valid} />}
          {activeTab === 1 && <Register_profile valid={setTab2Valid} />}
          {activeTab === 2 && <Register_integrity valid={setTab3Valid} />}
          {activeTab === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Final Review</h2>

              {/* Identity Section */}
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Profile Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p>
                    <strong>Title:</strong> {encodedTitle}
                  </p>
                  <p>
                    <strong>Entity:</strong> {encodedName}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {registerData?.metadata?.profile?.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Country:</strong>{" "}
                    {registerData?.metadata?.profile?.country || "N/A"}
                  </p>
                </div>
                <p className="mt-2 text-sm">
                  <strong>Summary:</strong> {encodedSummary}
                </p>

                {/* Temporary Image Preview */}
                {registerData?.display_image instanceof File && (
                  <div className="mt-4">
                    <p className="mb-1 text-xs font-bold">Profile Image:</p>
                    <img
                      src={URL.createObjectURL(registerData.display_image)}
                      alt="Preview"
                      className="h-20 w-20 rounded border object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Permissions/Files Section */}
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">Submitted Documents</h3>
                {registerData?.metadata?.permissions?.length > 0 ? (
                  <ul className="space-y-2">
                    {registerData.metadata.permissions.map((_, i) => {
                      const file = registerData.permission_files?.[i] // Assuming you added this array
                      return (
                        <li
                          key={i}
                          className="flex items-center justify-between rounded bg-secondary/50 p-2 text-sm"
                        >
                          <span>
                            {registerData.permission_keys?.[i] || "Document"}
                          </span>
                          {file && (
                            <a
                              href={URL.createObjectURL(file)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline hover:text-primary/80"
                            >
                              View File
                            </a>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                ) : (
                  <p className="text-sm italic">No documents attached.</p>
                )}
              </div>
            </div>
          )}
          <div className="mt-8 flex gap-4">
            <Button
              variant="ghost"
              disabled={activeTab === 0 || isPending}
              onClick={() => setActiveTab((t) => t - 1)}
            >
              Back
            </Button>
            <Button
              disabled={stepIsInvalid || isPending}
              onClick={() =>
                activeTab < 3 ? setActiveTab((t) => t + 1) : handleFinalSubmit()
              }
            >
              {isPending ? (
                <CircleNotch className="mr-2 animate-spin" />
              ) : activeTab === 3 ? (
                "Submit Application"
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>

        <aside className="w-full rounded-xl border border-border bg-card p-6 md:w-72">
          <h3 className="mb-4 font-bold">Application Audit</h3>
          <AuditItem
            label="Identity"
            status={tab1Valid}
            sub={tab1Valid ? "Verified" : "Pending"}
          />
          <AuditItem label="Profile" status={tab2Valid} sub={encodedName} />
          <div className="mt-4 space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">
              Integrity & Permissions
            </p>
            {registerData?.metadata?.permissions?.length > 0 ? (
              registerData.metadata.permissions.map((_, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span>{registerData?.permission_keys?.[i] || "Sector"}</span>
                  <CheckCircleIcon className="text-green-500" weight="fill" />
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No permissions added
              </p>
            )}
          </div>
        </aside>
      </main>
    </div>
  )
}
