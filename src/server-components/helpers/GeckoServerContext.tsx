import { createContext, PropsWithChildren, useEffect, useState } from "react"
import geckos, { ChannelId, Data, GeckosServer, ServerChannel } from "@geckos.io/server"
import { useEntities } from "../../components/entities/useEntities"

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

// do: we need to figure out how to make sure we only instantiate the server once,
//     but always get up-to-date channels and entities
export const GeckoServerProvider = (props: PropsWithChildren) => {
  const { entities } = useEntities()
  const [initialized, setInitialized] = useState(false)
  const [io, setIo] = useState<GeckosServer | null>(null)
  const [channels, setChannels] = useState<ServerChannel[]>([])

  useEffect(() => {
    if (io) return

    const newIo = geckos()

    newIo.listen(5544) // default port is 9208

    newIo.onConnection((channel) => {
      setChannels((prevChannels) => [...prevChannels.filter((c) => c.id !== channel.id), channel])

      // do: when new user connects, send all the entities to the new user
      console.log("setEntities", channels.length, Object.keys(entities).length)
      channel.emit("setEntities", {
        entities: channels.map((c) => ({
          channelId: c.id,
          position: [0, 0, 0],
          rotationY: 0,
          path: [],
        })),
      })

      channel.onDisconnect(() => {
        newIo.room(channel.roomId).emit("player disconnected", { channelId: channel.id })

        setChannels((prevChannels) => prevChannels.filter((c) => c.id !== channel.id))
      })

      newIo.room(channel.roomId).emit("player connected", {
        channelId: channel.id,
        position: [0, 0, 0],
        rotationY: 0,
        path: [],
      })
    })

    setIo(newIo)
    setInitialized(true)
  }, [channels, entities, io])

  if (!initialized || !io || !channels) return null

  const emit: GeckosServer["emit"] = (eventName, data) => io.emit(eventName, data)

  const on: On = (event, callback) => {
    console.log("listening on event", event, "for", channels.length, "channels")
    channels.forEach((channel) => {
      channel.on(event, (data, sender) => {
        callback(io, channel, data, sender)
      })
    })
  }

  return <GeckoServerContext.Provider value={{ on, emit }}>{props.children}</GeckoServerContext.Provider>
}
