import geckos, { ChannelId, ClientChannel } from "@geckos.io/client"
import { createContext, PropsWithChildren, useEffect, useState } from "react"
import { useEntities } from "../../components/entities/useEntities"
import { Entity } from "../../components/entities/EntitiesContext"

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

type Message = {
  channelId: string
} & Record<string, unknown>

const isValidMessage = (data: unknown): data is Message => {
  if (typeof data !== "object") return false
  if (data === null) return false

  return "channelId" in data
}

const isValidSetEntitiesMessage = (data: unknown): data is Message & { entities: Entity[] } => {
  if (!isValidMessage(data)) return false

  return "entities" in data
}

const messageContainsEntityData = (data: unknown): data is Message & Entity => {
  if (!isValidMessage(data)) return false

  return "position" in data && "rotationY" in data && "path" in data
}

export const GeckoClientProvider = (props: PropsWithChildren) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [channel, setChannel] = useState<ClientChannel | null>(null)

  const { entities, forceUpdate } = useEntities()

  useEffect(() => {
    if (isConnecting || connected) return

    // react strict mode is causing this to run twice ...
    console.log(isConnecting, connected, channel)

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
        if (!messageContainsEntityData(data)) return

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

      data.entities.forEach((entity) => {
        entities[entity.channelId] = entity
      })

      forceUpdate()
    })

    newChannel.on("player disconnected", (data) => {
      if (!isValidMessage(data)) return

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
