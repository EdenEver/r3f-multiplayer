import { useEffect } from "react"
import { useGeckoClient } from "./helpers/useGeckoClient"
import { useEntities } from "../components/entities/useEntities"
import { isValidPathMessage } from "../components/networking/networkMessageValidation"

const ClientEntityMovement = () => {
  const { on } = useGeckoClient()
  const { entities, forceUpdate } = useEntities()

  useEffect(() => {
    on("setPath", (data) => {
      if (!isValidPathMessage(data)) return
      if (!entities[data.channelId]) return

      // should we do this? client side prediction with reconciliation
      entities[data.channelId].position = data.position
      entities[data.channelId].path = data.path

      forceUpdate()
    })
  }, [on, entities, forceUpdate])

  return null
}

export default ClientEntityMovement
