import { Entity, EntityId, FullEntityState, PartialEntityState } from "r3f-multiplayer"
import { createContext, createRef, PropsWithChildren, useCallback, useState } from "react"
import { Group } from "three"

type EntitiesContextType = {
  __getEntitiesRaw: () => Record<string, Entity>
  getEntityIds: () => string[]
  addEntity: (state: FullEntityState) => void
  updateEntity: (state: PartialEntityState) => void
  removeEntity: (id: string) => void
  updatedAt: number
}

export const EntitiesContext = createContext<EntitiesContextType>({
  __getEntitiesRaw: () => ({}),
  getEntityIds: () => [],
  addEntity: () => {},
  updateEntity: () => {},
  removeEntity: () => {},
  updatedAt: 0,
})

// NOTE(Alan): Future improvement: Keep a separate list of entity ids to avoid iterating over the entities object
//             We only want to access the entity when we actually need it
export const EntitiesProvider = (props: PropsWithChildren) => {
  const [updatedAt, setUpdatedAt] = useState(0)
  const [entities, setEntities] = useState<Record<string, Entity>>({})

  const addEntity = useCallback(
    (state: FullEntityState) => {
      if (!state.id || entities[state.id]) return

      setEntities((entities) => {
        entities[state.id] = {
          ...state,
          ref: createRef<Group>(),
        }

        return entities
      })

      setUpdatedAt(Date.now())
    },
    [entities]
  )

  const updateEntity = useCallback(
    (state: PartialEntityState) => {
      if (!state.id || !entities[state.id]) return

      const { id, position, rotationY, action, path } = state

      setEntities((entities) => {
        if (path) entities[id].path = path
        if (action) entities[id].action = action

        if (entities[id].ref.current) {
          if (position) entities[id].ref.current.position.set(...position)
          if (rotationY) entities[id].ref.current.rotation.y = rotationY
        }

        return entities
      })

      setUpdatedAt(Date.now())
    },
    [entities]
  )

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
        addEntity,
        updateEntity,
        removeEntity,
        updatedAt,
      }}
    >
      {props.children}
    </EntitiesContext.Provider>
  )
}
