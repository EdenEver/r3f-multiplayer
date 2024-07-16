import geckoss, { ChannelId, ClientChannel } from "@geckos.io/client"
import { createContext, PropsWithChildren, useEffect, useRef, useState } from "react"
import {
  isValidPlayerConnectedMessage,
  isValidPlayerDisconnectedMessage,
  isValidSetEntitiesMessage,
} from "../../components/networking/networkMessageValidation"
import { useRemoveEntity, useAddOrUpdateEntity } from "../../components/entities/entityHooks"
import { FullEntityState } from "r3f-multiplayer"

type GeckosClientContextType = {
  channelId: ChannelId
  emit: ClientChannel["emit"]
  on: ClientChannel["on"]
}

export const GeckosClientContext = createContext<GeckosClientContextType>({
  channelId: "",
  emit: () => {},
  on: () => {},
})

export const GeckosClientProvider = (props: PropsWithChildren) => {
  const connecting = useRef(false)
  const connected = useRef(false)

  const [channel, setChannel] = useState<ClientChannel | null>(null)

  const addOrUpdateEntity = useAddOrUpdateEntity()
  const removeEntity = useRemoveEntity()

  useEffect(() => {
    if (connecting.current) return
    connecting.current = true

    if (connected.current || channel) return

    const newChannel = geckoss({ port: 5544 }) // default port is 9208

    newChannel.onConnect((error) => {
      if (error) {
        console.error(error.message)

        connecting.current = false
        connected.current = false

        return
      }

      connecting.current = false
      connected.current = true

      newChannel.on("player connected", (data) => {
        if (!isValidPlayerConnectedMessage(data)) return

        const state: FullEntityState = {
          id: data.channelId,
          position: data.position,
          rotationY: data.rotationY,
          path: data.path,
          action: "Idle",
        }

        addOrUpdateEntity(state)
      })
    })

    newChannel.on("setEntities", (data) => {
      if (!isValidSetEntitiesMessage(data)) return

      Object.values(data.entities).forEach((entity) => {
        const state: FullEntityState = {
          id: entity.channelId,
          position: entity.position,
          rotationY: entity.rotationY,
          path: entity.path,
          action: "Idle",
        }

        console.log("adding entity in setEntities", state)

        addOrUpdateEntity(state)
      })
    })

    newChannel.on("player disconnected", (data) => {
      if (!isValidPlayerDisconnectedMessage(data)) return

      removeEntity(data.channelId)
    })

    setChannel(newChannel)

    if (newChannel.id) {
      console.log("adding entity in channel id", newChannel.id)

      addOrUpdateEntity({
        id: newChannel.id,
        position: [0, 0, 0],
        rotationY: 0,
        path: [],
        action: "Idle",
      })
    }

    return () => {
      if (newChannel.id) removeEntity(newChannel.id)

      if (channel) {
        newChannel.close()
        setChannel(null)
      }
    }
  }, [connecting, connected, channel, addOrUpdateEntity, removeEntity])

  if (!connected.current || !channel) return null

  const emit: ClientChannel["emit"] = (eventName, data) => channel.emit(eventName, data)

  const on: ClientChannel["on"] = (eventName, callback) => channel.on(eventName, callback)

  return (
    <GeckosClientContext.Provider value={{ emit, on, channelId: channel.id }}>
      {props.children}
    </GeckosClientContext.Provider>
  )
}
