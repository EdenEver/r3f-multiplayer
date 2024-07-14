import { Entity, EntityId, EntityState } from "r3f-multiplayer"
import { createContext, createRef, PropsWithChildren, useCallback, useState } from "react"
import { Group } from "three"

type EntitiesContextType = {
  entities: Record<string, Entity>
  addOrUpdateEntity: (state: EntityState) => void
  removeEntity: (id: string) => void
}

export const EntitiesContext = createContext<EntitiesContextType>({
  entities: {},
  addOrUpdateEntity: () => {},
  removeEntity: () => {},
})

// do: don't expose states directly, use get / set

export const EntitiesProvider = (props: PropsWithChildren) => {
  const [entities, setEntities] = useState<Record<string, Entity>>({})

  const addOrUpdateEntity = useCallback(
    (state: EntityState) => {
      const { id, position, rotationY, path } = state

      if (!id) return

      const newEntities = { ...entities }

      if (!newEntities[id]) {
        newEntities[id] = {
          id: id,
          path: path ?? [],
          ref: createRef<Group>(), // how to set position in this case?
        }
      } else {
        if (path) newEntities[id].path = path

        if (newEntities[id].ref.current) {
          if (position) newEntities[id].ref.current.position.set(...position)
          if (rotationY) newEntities[id].ref.current.rotation.y = rotationY
        }
      }

      setEntities(newEntities)
    },
    [entities]
  )

  const removeEntity = useCallback(
    (id: EntityId) => {
      if (!id) return

      const newEntities = { ...entities }

      delete newEntities[id]

      setEntities(newEntities)
    },
    [entities]
  )

  return (
    <EntitiesContext.Provider
      value={{
        entities,
        addOrUpdateEntity,
        removeEntity,
      }}
    >
      {props.children}
    </EntitiesContext.Provider>
  )
}
