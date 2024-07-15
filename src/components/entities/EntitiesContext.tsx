import { Entity, EntityId, EntityState } from "r3f-multiplayer"
import { createContext, createRef, PropsWithChildren, useCallback, useState } from "react"
import { Group } from "three"

type EntitiesContextType = {
  entities: Record<string, Entity>
  addOrUpdateEntity: (state: EntityState) => void
  removeEntity: (id: string) => void
  updatedAt: number
}

export const EntitiesContext = createContext<EntitiesContextType>({
  entities: {},
  addOrUpdateEntity: () => {},
  removeEntity: () => {},
  updatedAt: 0
})

// do: don't expose states directly, use get / set

export const EntitiesProvider = (props: PropsWithChildren) => {
  const [updatedAt, setUpdatedAt] = useState(0)
  const [entities, setEntities] = useState<Record<string, Entity>>({})

  const addOrUpdateEntity = useCallback((state: EntityState) => {
    const { id, action, position, rotationY, path } = state

    if (!id) return

    setEntities((entities) => {
      if (!entities[id]) {
        entities[id] = {
          id: id,
          path: path ?? [],
          action: "Idle",
          ref: createRef<Group>(), // how to set position in this case?
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

  return (
    <EntitiesContext.Provider
      value={{
        entities,
        addOrUpdateEntity,
        removeEntity,
        updatedAt
      }}
    >
      {props.children}
    </EntitiesContext.Provider>
  )
}
