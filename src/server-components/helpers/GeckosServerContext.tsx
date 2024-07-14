import { createContext, PropsWithChildren, useEffect, useRef, useState } from "react"
import geckos, { ChannelId, Data, GeckosServer, ServerChannel } from "@geckos.io/server"
import { EntityState } from "r3f-multiplayer"
import { useEntities, useRemoveEntity, useAddOrUpdateEntity } from "../../components/entities/entityHooks"
import { SetEntitiesMessage } from "../../components/networking/networkMessageValidation"

type OnCallback = (io: GeckosServer, channel: ServerChannel, data: Data, sender: ChannelId) => void
type On = (event: string, callback: OnCallback) => void

type GeckosServerContextType = {
  emit: GeckosServer["emit"]
  on: On
}

export const GeckosServerContext = createContext<GeckosServerContextType>({
  emit: () => {}, // noop
  on: () => {}, // noop
})

// Since there is no "off" function in geckos.io, this keeps a list of which channels are subscribed to which events
// To avoid multiple subscriptions to the same event
const useChannelSubscriptions = () => {
  const channelSubscriptions = useRef<Record<string, string[]>>({})

  return channelSubscriptions.current
}

// NOTE: Make sure we are not leaking memory with regards to the on and off functionality and
//       house keeping of channels

// do: on the server disambiguate between channels and entities
//     channels are the connection to the client, these could somewhat be merged
//     (but there are entities that are not connected players)

// do: we need to figure out how to make sure we only instantiate the server once,
//     but always get up-to-date channels and entities
export const GeckosServerProvider = (props: PropsWithChildren) => {
  const [initialized, setInitialized] = useState(false)
  const [io, setIo] = useState<GeckosServer | null>(null)
  const [channels, setChannels] = useState<ServerChannel[]>([])

  const entities = useEntities()
  const addOrUpdateEntity = useAddOrUpdateEntity()
  const removeEntity = useRemoveEntity()

  const channelSubscriptions = useChannelSubscriptions()

  useEffect(() => {
    if (io) return

    const newIo = geckos()

    newIo.listen(5544) // default port is 9208

    newIo.onConnection((channel) => {
      if (!channel.id) return

      setChannels((prevChannels) => [...prevChannels.filter((c) => c.id !== channel.id), channel])

      const state: EntityState = {
        id: channel.id,
        position: [0, 0, 0],
        rotationY: 0,
        path: [],
      }

      addOrUpdateEntity(state)

      const message: SetEntitiesMessage = {
        entities: Object.values(entities).map((entity) => ({
          channelId: entity.id,
          position: entity.ref.current?.position.toArray() || [0, 0, 0],
          rotationY: entity.ref.current?.rotation.y || 0,
          path: entity.path,
        })),
      }

      channel.emit("setEntities", message)

      channel.onDisconnect(() => {
        newIo.emit("player disconnected", { channelId: channel.id })

        if (!channel.id) return

        removeEntity(channel.id)

        if (channelSubscriptions[channel.id]) delete channelSubscriptions[channel.id]

        setChannels((prevChannels) => prevChannels.filter((c) => c.id !== channel.id))
      })

      newIo.emit("player connected", {
        channelId: channel.id,
        position: [0, 0, 0],
        rotationY: 0,
        path: [],
      })
    })

    setIo(newIo)
    setInitialized(true)
  }, [channels, entities, io, removeEntity, addOrUpdateEntity, channelSubscriptions])

  if (!initialized || !io || !channels) return null

  const emit: GeckosServer["emit"] = (eventName, data) => io.emit(eventName, data)

  // this is incoming messages
  const on: On = (event, callback) => {
    channels.forEach((channel) => {
      if (!channel.id) return

      if (!channelSubscriptions[channel.id]) {
        channelSubscriptions[channel.id] = []
      }

      if (channelSubscriptions[channel.id].includes(event)) return

      channelSubscriptions[channel.id].push(event)

      channel.on(event, (data, sender) => {
        callback(io, channel, data, sender)
      })
    })
  }

  return <GeckosServerContext.Provider value={{ on, emit }}>{props.children}</GeckosServerContext.Provider>
}
