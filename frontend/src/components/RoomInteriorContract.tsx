import React, { useState } from "react"
import ReactMarkdown from "react-markdown"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import {
  Signature,
  WarningCircle,
  CheckCircle,
  ShieldCheck,
} from "@phosphor-icons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PatchRoomOption } from "@/api/option/room"
import type { RoomContract, ApiRoom } from "@/api/config/types/room"

export const ProtocolContract = ({
  room,
  contract,
}: {
  room: ApiRoom
  contract: RoomContract
}) => {
  const queryClient = useQueryClient()

  // Initialize signed state: replace "CURRENT_ACTOR_ID" with your actual auth context ID
  const [isSigned, setIsSigned] = useState(
    contract.signed?.includes("CURRENT_ACTOR_ID") ?? false
  )

  const { mutate: signContract, isPending } = useMutation({
    ...PatchRoomOption(),
    onSuccess: () => {
      setIsSigned(true)
      // Refetch the room to update global state
      queryClient.invalidateQueries({ queryKey: ["RoomItem", room.id] })
    },
  })

  const handleSign = () => {
    signContract({
      id: room.id,
      data: {
        contract: {
          signed: [...(contract.signed || []), "CURRENT_ACTOR_ID"],
        },
      },
    })
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12 pb-20">
      {/* --- HEADER --- */}
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="rounded-full bg-primary/10 p-4 ring-1 ring-primary/20">
          <ShieldCheck size={32} weight="duotone" className="text-primary" />
        </div>
        <h2 className="text-[10px] font-black tracking-[0.4em] text-primary uppercase">
          Legally Binding Protocol v{contract.version}.0
        </h2>
        <p className="max-w-xl text-lg font-bold italic opacity-80">
          "{contract.introduction}"
        </p>
      </div>

      {/* --- DYNAMIC CLAUSES --- */}
      <div className="grid gap-6 md:grid-cols-2">
        {Object.entries(contract.sections || {}).map(
          ([key, content], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full rounded-[2rem] border-none bg-card p-8 shadow-sm ring-1 ring-border">
                <div className="mb-4 flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="rounded-md font-black uppercase"
                  >
                    Clause {index + 1}
                  </Badge>
                  <span className="text-[10px] font-black text-muted-foreground uppercase opacity-40">
                    {key.replace("_", " ")}
                  </span>
                </div>
                <div className="prose prose-invert prose-xs text-[11px] leading-relaxed text-muted-foreground/80 italic">
                  <ReactMarkdown>{content as string}</ReactMarkdown>
                </div>
              </Card>
            </motion.div>
          )
        )}
      </div>

      {/* --- ACTIONS --- */}
      <div className="sticky bottom-8 flex flex-col items-center justify-center gap-4 px-4 sm:flex-row">
        <Button
          variant="outline"
          size="lg"
          onClick={() => alert("Initializing Formal Dispute Protocol...")}
          className="w-full rounded-full border-red-500/20 bg-background px-8 text-[10px] font-black tracking-widest text-red-500 uppercase hover:bg-red-500/10 sm:w-auto"
        >
          <WarningCircle size={18} className="mr-2" weight="bold" />
          Raise Protocol Issue
        </Button>

        <Button
          size="lg"
          onClick={handleSign}
          disabled={isSigned || isPending}
          className={`w-full rounded-full px-10 text-[10px] font-black tracking-widest uppercase transition-all duration-700 sm:w-auto ${
            isSigned ? "bg-green-600" : "bg-primary"
          }`}
        >
          {isPending ? (
            "VERIFYING..."
          ) : isSigned ? (
            <>
              <CheckCircle size={18} className="mr-2" weight="bold" /> Signed
            </>
          ) : (
            <>
              <Signature size={18} className="mr-2" weight="bold" /> Verify &
              Sign
            </>
          )}
        </Button>
      </div>

      {/* --- ANIMATION --- */}
      <AnimatePresence>
        {isSigned && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="animate-ping rounded-full border border-primary bg-background/80 p-10 opacity-20" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
