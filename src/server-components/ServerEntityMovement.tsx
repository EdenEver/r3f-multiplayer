import { useEffect } from "react"
import { Group } from "three"
import { useGeckosServer } from "./helpers/useGeckosServer"
import { isValidPathMessage } from "../components/networking/networkMessageValidation"
import { PathMessage } from "r3f-multiplayer"
import { useUpdateEntity } from "../components/entities/entityHooks"

type Props = {
  entity: React.MutableRefObject<Group | null>
}

// do: do not sync state, but rather sync actions and do full client-side prediction
// do: get click and replay on server, rather than trusting client
//     or just verify that the click was possible

const ServerEntityMovement = ({ entity }: Props) => {
  const { on, emit } = useGeckosServer()
  const updateEntity = useUpdateEntity()

  useEffect(() => {
    on("setPath", (io, _channel, data) => {
      console.log("setting path on the server")

      if (!isValidPathMessage(data)) return

      const args = {
        id: data.channelId,
        position: data.position,
        path: data.path,
      }

      updateEntity(args)

      const message: PathMessage = {
        channelId: data.channelId,
        position: data.position,
        path: data.path,
      }

      io.emit("setPath", message)
    })
  }, [emit, entity, on, updateEntity])

  return null
}

export default ServerEntityMovement
