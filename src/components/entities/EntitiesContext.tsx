import { Entity } from "r3f-multiplayer"
import { createContext, PropsWithChildren, useRef, useState } from "react"

type EntitiesContextType = {
  forceUpdate: () => void
  lastUpdated: number
  entities: Record<string, Entity>
}

export const EntitiesContext = createContext<EntitiesContextType>({
  lastUpdated: 0,
  forceUpdate: () => {},
  entities: {},
})

export const EntitiesProvider = (props: PropsWithChildren) => {
  const [lastUpdated, setLastUpdate] = useState(Date.now())

  const forceUpdate = () => {
    setLastUpdate(Date.now())
  }

  const entities = useRef<Record<string, Entity>>({})

  return (
    <EntitiesContext.Provider value={{ entities: entities.current, lastUpdated, forceUpdate }}>
      {props.children}
    </EntitiesContext.Provider>
  )
}
