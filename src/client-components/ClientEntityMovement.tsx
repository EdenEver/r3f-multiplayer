import { useEffect } from "react"
import { useGeckosClient } from "./helpers/useGeckosClient"
import { isValidPathMessage } from "../components/networking/networkMessageValidation"
import { useUpdateEntity } from "../components/entities/entityHooks"

// do: rename, this does not handle movement, but server/client path communication
const ClientEntityMovement = () => {
  const { on } = useGeckosClient()
  const updateEntity = useUpdateEntity()

  useEffect(() => {
    on("setPath", (data) => {
      if (!isValidPathMessage(data)) return

      const args = {
        id: data.channelId,
        position: data.position,
        path: data.path,
      }

      if (!isValidPathMessage(data)) return

      updateEntity(args)
    })
  }, [on, updateEntity])

  return null
}

export default ClientEntityMovement
