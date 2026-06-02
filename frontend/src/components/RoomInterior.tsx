/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence } from "framer-motion"
import { useMemo, useState } from "react"

import { RoomHeader } from "./RoomInteriorHeader"
import { RoomNavbar } from "./RoomInteriorNavabar"
import { GetMeOption } from "@/api/option/user"
import { GetMyRoomsOption } from "@/api/option/room"
import { GetHydratedRoomMembersOption } from "@/api/option/room_member"
import { RoomOverviewContent } from "./RoomInteriorOverview"
import { ProtocolContract } from "./RoomInteriorContract"
import { RoomTimelineCalendar } from "./RoomInteriorCalendar"
import { RoomInteriorMessage } from "./RoomInteriorMessage"
import { RoomLogisticsManager } from "./RoomInteriorLogistic"

const renderTabContent = (activeTab: string, data: any) => {
  switch (activeTab) {
    case "overview":
      return <RoomOverviewContent room={data.room} />

    case "contract":
      // return <RoomContract room={room} />; (Placeholder for your future component)
      return <ProtocolContract room={data.room} contract={data.contract} />

    case "plan":
      return <RoomTimelineCalendar roomId={data.room.id} />

    case "communication":
      return (
        <RoomInteriorMessage
          roomId={data.room.id}
          currentUser={data.currentUser}
        />
      )

    case "logistics":
      return (
        <RoomLogisticsManager
          roomId={data.room.id}
          currentUser={data.currentUser}
        />
      )

    default:
      return null
  }
}

export const RoomInterior = () => {
  const { roomName } = useParams<{ roomName: string }>()
  const [activeTab, setActiveTab] = useState("overview")

  const { data: me } = useQuery(GetMeOption())
  const { data: roomsResponse, isLoading: roomsLoading } =
    useQuery(GetMyRoomsOption())

  const room = useMemo(() => {
    return roomsResponse?.ans?.find((r: any) => r.name === roomName)
  }, [roomsResponse, roomName])

  // FIX: Using your new hydrated member query
  const { data: membersResponse } = useQuery({
    ...GetHydratedRoomMembersOption(room?.id || ""),
    enabled: !!room?.id,
  })

  // Normalize member data based on HydratedRoomMembersResponse structure
  const members = useMemo(() => {
    return membersResponse || []
  }, [membersResponse])

  if (roomsLoading)
    return (
      <div className="animate-pulse p-20 text-center font-black">
        DECRYPTING CHAMBER NODE...
      </div>
    )

  if (!room)
    return <div className="p-20 text-center font-black">NODE NOT FOUND</div>

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <RoomHeader
        roomName={room.name}
        roomId={room.id}
        members={members}
        onAddMember={() => {}}
      />
      <RoomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="mx-auto w-full max-w-7xl flex-1 p-8">
        <AnimatePresence mode="wait">
          {renderTabContent(activeTab, {
            room,
            members,
            contract: room.contract,
            currentUser: me?.ans,
          })}
        </AnimatePresence>
      </main>
    </div>
  )
}
