import { createContext, PropsWithChildren, useEffect, useState } from "react"
import geckos, { ChannelId, Data, GeckosServer, ServerChannel } from "@geckos.io/server"
import { useEntities, useRemoveEntity, useAddOrUpdateEntity } from "../../components/entities/entityHooks"
import { EntityState } from "r3f-multiplayer"
import { SetEntitiesMessage } from "../../components/networking/networkMessageValidation"

type On = (
  event: string,
  callback: (io: GeckosServer, channel: ServerChannel, data: Data, sender: ChannelId) => void
) => void

type GeckoServerContextType = {
  emit: GeckosServer["emit"]
  on: On
}

export const GeckoServerContext = createContext<GeckoServerContextType>({
  emit: () => {}, // noop
  on: () => {}, // noop
})

// do: on the server disambiguate between channels and entities
//     channels are the connection to the client, these could somewhat be merged
//     (but there are entities that are not connected players)

// do: we need to figure out how to make sure we only instantiate the server once,
//     but always get up-to-date channels and entities
export const GeckoServerProvider = (props: PropsWithChildren) => {
  const [initialized, setInitialized] = useState(false)
  const [io, setIo] = useState<GeckosServer | null>(null)
  const [channels, setChannels] = useState<ServerChannel[]>([])

  const entities = useEntities()
  const addOrUpdateEntity = useAddOrUpdateEntity()
  const removeEntity = useRemoveEntity()

  useEffect(() => {
    if (io) return

    const newIo = geckos()

    newIo.listen(5544) // default port is 9208

    newIo.onConnection((channel) => {
      if (!channel.id) return

      console.log("new connection", channel.id, channels, entities)

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

        if (channel.id) removeEntity(channel.id)

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
  }, [channels, entities, io, removeEntity, addOrUpdateEntity])

  if (!initialized || !io || !channels) return null

  const emit: GeckosServer["emit"] = (eventName, data) => io.emit(eventName, data)

  const on: On = (event, callback) => {
    channels.forEach((channel) => {
      channel.on(event, (data, sender) => {
        callback(io, channel, data, sender)
      })
    })
  }

  return <GeckoServerContext.Provider value={{ on, emit }}>{props.children}</GeckoServerContext.Provider>
}
