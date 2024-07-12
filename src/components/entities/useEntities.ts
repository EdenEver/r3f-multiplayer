import { useContext } from "react"
import { EntitiesContext } from "./EntitiesContext"
import { useGeckoClient } from "../../client-components/helpers/useGeckoClient"

export const useEntities = () => {
  const { entities, lastUpdated, forceUpdate } = useContext(EntitiesContext)

  return {
    entities,
    lastUpdated,
    forceUpdate,
  }
}

export const useOwnEntity = () => {
  const { channelId } = useGeckoClient()
  const { entities } = useEntities()

  if (!channelId) return null

  return entities[channelId]
}
