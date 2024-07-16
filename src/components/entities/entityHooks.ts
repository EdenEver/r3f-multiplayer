import { MutableRefObject, useCallback, useContext, useEffect, useMemo } from "react"
import { Group } from "three"
import { Entity, EntityId, FullEntityState } from "r3f-multiplayer"
import { useGeckosClient } from "../../client-components/helpers/useGeckosClient"
import { EntitiesContext } from "./EntitiesContext"

export const useEntities = () => {
  const { __getEntitiesRaw } = useContext(EntitiesContext)

  const entities = useMemo(() => __getEntitiesRaw(), [__getEntitiesRaw])

  return entities
}

export const useEntityIds = () => {
  const { getEntityIds } = useContext(EntitiesContext)

  const ids = useMemo(() => getEntityIds(), [getEntityIds])

  return ids
}

export const useEntity = (id?: EntityId): Entity | null => {
  const { __getEntitiesRaw } = useContext(EntitiesContext)

  const entities = __getEntitiesRaw()

  const entity = useMemo(() => {
    if (!id) return null

    return entities[id] ?? null
  }, [entities, id])

  return entity
}

export const useUpdateEntity = () => {
  const { updateEntity } = useContext(EntitiesContext)

  return updateEntity
}

// NOTE(Alan): This is primarily meant to be used for adding entities,
//             with a fallback to updating them if they already exist
export const useAddOrUpdateEntity = () => {
  const { __getEntitiesRaw, addEntity, updateEntity } = useContext(EntitiesContext)

  const addOrUpdateEntity = useCallback(
    (state: FullEntityState) => {
      if (__getEntitiesRaw()[state.id]) {
        updateEntity(state)
      } else {
        addEntity(state)
      }
    },
    [__getEntitiesRaw, addEntity, updateEntity]
  )

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
  const { channelId } = useGeckosClient()
  const entity = useEntity(channelId)

  return entity
}

export const useRerenderOnEntitiesUpdate = () => {
  const { updatedAt } = useContext(EntitiesContext)

  useEffect(() => {}, [updatedAt])

  return updatedAt
}

export const useEntityAction = (id?: EntityId) => {
  const entity = useEntity(id)
  const updateEntity = useUpdateEntity()

  const setAction = useCallback(
    (action: Entity["action"]) => {
      if (!entity) return

      updateEntity({
        id: entity.id,
        action,
      })
    },
    [entity, updateEntity]
  )

  const action = useMemo(() => entity?.action ?? "Idle", [entity?.action])

  return { action, setAction }
}
