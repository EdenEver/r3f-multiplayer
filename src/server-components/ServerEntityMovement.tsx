import { useEffect } from "react"
import { Group } from "three"
import { useGeckoServer } from "./helpers/useGeckoServer"
import { isValidPathMessage } from "../components/networking/networkMessageValidation"
import { useEntities } from "../components/entities/useEntities"

type Props = {
  entity: React.MutableRefObject<Group | null>
}

// do: do not sync state, but rather sync actions and do full client-side prediction
// do: get click and replay on server, rather than trusting client
//     or just verify that the click was possible

const ServerEntityMovement = ({ entity }: Props) => {
  const { on, emit } = useGeckoServer()
  const { entities, forceUpdate } = useEntities()

  useEffect(() => {
    on("setPath", (io, _channel, data) => {
      if (!isValidPathMessage(data)) return
      if (!entities[data.channelId]) return

      entities[data.channelId].position = data.position
      entities[data.channelId].path = data.path

      forceUpdate()

      io.emit("setPath", data)
    })
  }, [emit, entities, entity, forceUpdate, on])

  return null
}

export default ServerEntityMovement
