import geckoss, { ChannelId, ClientChannel } from "@geckos.io/client"
import { createContext, PropsWithChildren, useEffect, useState } from "react"
import {
  isValidPlayerConnectedMessage,
  isValidPlayerDisconnectedMessage,
  isValidSetEntitiesMessage,
} from "../../components/networking/networkMessageValidation"
import { useRemoveEntity, useAddOrUpdateEntity } from "../../components/entities/entityHooks"
import { EntityState } from "r3f-multiplayer"

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
  const [isConnecting, setIsConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [channel, setChannel] = useState<ClientChannel | null>(null)

  const addOrUpdateEntity = useAddOrUpdateEntity()
  const removeEntity = useRemoveEntity()

  // const ctx = useContext(EntitiesContext)

  useEffect(() => {
    if (isConnecting || connected) return

    setIsConnecting(true)

    const newChannel = geckoss({ port: 5544 }) // default port is 9208

    newChannel.onConnect((error) => {
      if (error) {
        console.error(error.message)

        setConnected(false)
        setIsConnecting(false)

        return
      }

      setConnected(true)
      setIsConnecting(false)

      newChannel.on("player connected", (data) => {
        if (!isValidPlayerConnectedMessage(data)) return

        const state: EntityState = {
          id: data.channelId,
          position: data.position,
          rotationY: data.rotationY,
          path: data.path,
        }

        addOrUpdateEntity(state)
      })
    })

    newChannel.on("setEntities", (data) => {
      if (!isValidSetEntitiesMessage(data)) return

      Object.values(data.entities).forEach((entity) => {
        const state: EntityState = {
          id: entity.channelId,
          position: entity.position,
          rotationY: entity.rotationY,
          path: entity.path,
        }

        addOrUpdateEntity(state)
      })
    })

    newChannel.on("player disconnected", (data) => {
      if (!isValidPlayerDisconnectedMessage(data)) return

      removeEntity(data.channelId)
    })

    setChannel(newChannel)

    if (newChannel.id) {
      addOrUpdateEntity({
        id: newChannel.id,
        position: [0, 0, 0],
        rotationY: 0,
        path: [],
      })
    }

    return () => {
      if (channel) {
        channel.close()
        setChannel(null)
      }
    }
  }, [isConnecting, connected, channel, addOrUpdateEntity, removeEntity])

  if (!connected || !channel) return null

  const emit: ClientChannel["emit"] = (eventName, data) => channel.emit(eventName, data)

  const on: ClientChannel["on"] = (eventName, callback) => channel.on(eventName, callback)

  return (
    <GeckosClientContext.Provider value={{ emit, on, channelId: channel.id }}>
      {props.children}
    </GeckosClientContext.Provider>
  )
}
