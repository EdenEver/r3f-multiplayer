import { useEffect } from "react"
import { useGeckoClient } from "./helpers/useGeckoClient"
import { isValidPathMessage } from "../components/networking/networkMessageValidation"
import { useAddOrUpdateEntity } from "../components/entities/entityHooks"

// do: rename, this does not handle movement, but server/client path communication
const ClientEntityMovement = () => {
  const { on } = useGeckoClient()
  const addOrUpdateEntity = useAddOrUpdateEntity()

  useEffect(() => {
    on("setPath", (data) => {
      if (!isValidPathMessage(data)) return

      const args = {
        id: data.channelId,
        position: data.position,
        path: data.path,
      }

      if (!isValidPathMessage(data)) return

      addOrUpdateEntity(args)
    })
  }, [on, addOrUpdateEntity])

  return null
}

export default ClientEntityMovement
