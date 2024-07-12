import { useEffect } from "react"
import { Group } from "three"
import { useGeckoServer } from "./helpers/useGeckoServer"

type Props = {
  entity: React.MutableRefObject<Group | null>
}

// do: do not sync state, but rather sync actions and do full client-side prediction
// do: get click and replay on server, rather than trusting client
//     or just verify that the click was possible

const ServerEntityMovement = ({ entity }: Props) => {
  const { on, emit } = useGeckoServer()

  console.log("hi")
  useEffect(() => {
    on("setPath", (io, channel, data) => {
      console.log("set path on the server", JSON.stringify(data))
      // if data is a valid object
      if (typeof data !== "object") return

      io.emit("setPath", {
        channelId: channel.id,
        ...data,
      })

      // io.room(channel.roomId).emit("setPath", {
      //   channelId: channel.id,
      //   ...data,
      // })
    })

    //   if (entity.current) {
    //     const interval = setInterval(() => {
    //       emit("updateEntity", {
    //         position: entity.current?.position.toArray(),
    //         rotationY: entity.current?.rotation.y,
    //       })
    //     }, 1000)

    //     return () => clearInterval(interval)
    //   }
  }, [emit, entity, on])

  return null
}

export default ServerEntityMovement
