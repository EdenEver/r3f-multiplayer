import { createContext, PropsWithChildren, useRef, useState } from "react"
import { Path } from "../Scene"

// do: move type definition to a shared location

export type Entity = {
  channelId: string
  position: [number, number, number]
  rotationY: number
  path: Path
}

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
