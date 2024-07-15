import { Entity, EntityId, EntityState } from "r3f-multiplayer"
import { createContext, createRef, PropsWithChildren, useCallback, useState } from "react"
import { Group } from "three"

type EntitiesContextType = {
  __getEntitiesRaw: () => Record<string, Entity>
  getEntityIds: () => string[]
  addOrUpdateEntity: (state: EntityState) => void
  removeEntity: (id: string) => void
  updatedAt: number
}

export const EntitiesContext = createContext<EntitiesContextType>({
  __getEntitiesRaw: () => ({}),
  getEntityIds: () => [],
  addOrUpdateEntity: () => {},
  removeEntity: () => {},
  updatedAt: 0,
})

const createStartingEntities = () => {
  const entities: Record<string, Entity> = {}

  // seems like instancing is not working - do: fix this!
  for (let i = 0; i < 10; i++) {
    const entity: Entity = {
      // uuid
      id: Math.random().toString(36).substring(7),
      action: "Idle",
      path: [],
      ref: createRef<Group>(),
    }

    entities[entity.id] = entity
  }

  return entities
}

// NOTE(Alan): Future improvement: Keep a separate list of entity ids to avoid iterating over the entities object
//             We only want to access the entity when we actually need it
export const EntitiesProvider = (props: PropsWithChildren) => {
  const [updatedAt, setUpdatedAt] = useState(0)
  const [entities, setEntities] = useState<Record<string, Entity>>(createStartingEntities())

  const addOrUpdateEntity = useCallback((state: EntityState) => {
    const { id, action, position, rotationY, path } = state

    if (!id) return

    setEntities((entities) => {
      if (!entities[id]) {
        entities[id] = {
          id: id,
          path: path ?? [],
          action: "Idle",
          ref: createRef<Group>(),
        }
      } else {
        if (path) entities[id].path = path
        if (action) entities[id].action = action

        if (entities[id].ref.current) {
          if (position) entities[id].ref.current.position.set(...position)
          if (rotationY) entities[id].ref.current.rotation.y = rotationY
        }
      }

      return entities
    })

    setUpdatedAt(Date.now())
  }, [])

  const removeEntity = useCallback((id: EntityId) => {
    if (!id) return

    setEntities((entities) => {
      delete entities[id]
      return entities
    })

    setUpdatedAt(Date.now())
  }, [])

  const __getEntitiesRaw = useCallback(() => entities, [entities])

  const getEntityIds = useCallback(() => Object.keys(entities), [entities])

  return (
    <EntitiesContext.Provider
      value={{
        __getEntitiesRaw,
        getEntityIds,
        addOrUpdateEntity,
        removeEntity,
        updatedAt,
      }}
    >
      {props.children}
    </EntitiesContext.Provider>
  )
}
