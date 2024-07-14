import { MutableRefObject, useContext, useMemo } from "react"
import { Group } from "three"
import { Entity, EntityId } from "r3f-multiplayer"
import { useGeckoClient } from "../../client-components/helpers/useGeckoClient"
import { EntitiesContext } from "./EntitiesContext"

export const useEntities = () => {
  const { entities } = useContext(EntitiesContext)

  return entities
}

export const useEntity = (id?: EntityId): Entity | null => {
  const { entities } = useContext(EntitiesContext)

  const entity = useMemo(() => {
    if (!id) return null

    return entities[id] ?? null
  }, [entities, id])

  return entity
}

export const useAddOrUpdateEntity = () => {
  const { addOrUpdateEntity } = useContext(EntitiesContext)

  return addOrUpdateEntity
}

export const useEntityRef = (id?: EntityId): MutableRefObject<Group | null> | null => {
  const entity = useEntity(id)

  const ref = useMemo(() => {
    if (!entity) return null

    return entity.ref
  }, [entity])

  return ref
}

export const useRemoveEntity = () => {
  const { removeEntity } = useContext(EntitiesContext)

  return removeEntity
}

export const useOwnEntity = (): Entity | null => {
  const { channelId } = useGeckoClient()
  const entity = useEntity(channelId)

  return entity
}
