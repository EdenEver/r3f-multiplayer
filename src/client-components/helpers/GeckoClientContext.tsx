import geckos, { ChannelId, ClientChannel } from "@geckos.io/client"
import { createContext, PropsWithChildren, useEffect, useState } from "react"
import { useEntities } from "../../components/entities/useEntities"
import {
  isValidPlayerConnectedMessage,
  isValidPlayerDisconnectedMessage,
  isValidSetEntitiesMessage,
} from "../../components/networking/networkMessageValidation"

type GeckoClientContextType = {
  channelId: ChannelId
  emit: ClientChannel["emit"]
  on: ClientChannel["on"]
}

export const GeckoClientContext = createContext<GeckoClientContextType>({
  channelId: "",
  emit: () => {},
  on: () => {},
})

export const GeckoClientProvider = (props: PropsWithChildren) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [channel, setChannel] = useState<ClientChannel | null>(null)

  const { entities, forceUpdate } = useEntities()

  useEffect(() => {
    if (isConnecting || connected) return

    setIsConnecting(true)

    const newChannel = geckos({ port: 5544 }) // default port is 9208

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

        if (!entities[data.channelId]) {
          entities[data.channelId] = {
            channelId: data.channelId,
            position: data.position,
            rotationY: data.rotationY,
            path: data.path ?? [],
          }
        }

        entities[data.channelId] = {
          channelId: data.channelId,
          position: data.position,
          rotationY: data.rotationY,
          path: data.path ?? [],
        }

        forceUpdate()
      })
    })

    newChannel.on("setEntities", (data) => {
      if (!isValidSetEntitiesMessage(data)) return

      Object.entries(data.entities).forEach(([key, entity]) => {
        entities[key] = entity
      })

      forceUpdate()
    })

    newChannel.on("player disconnected", (data) => {
      if (!isValidPlayerDisconnectedMessage(data)) return

      delete entities[data.channelId]
      forceUpdate()
    })

    setChannel(newChannel)

    return () => {
      if (channel) {
        channel.close()
        setChannel(null)
      }
    }
  }, [isConnecting, connected, channel, entities, forceUpdate])

  if (!connected || !channel) return null

  const emit: ClientChannel["emit"] = (eventName, data) => channel.emit(eventName, data)

  const on: ClientChannel["on"] = (eventName, callback) => channel.on(eventName, callback)

  return (
    <GeckoClientContext.Provider value={{ emit, on, channelId: channel.id }}>
      {props.children}
    </GeckoClientContext.Provider>
  )
}
