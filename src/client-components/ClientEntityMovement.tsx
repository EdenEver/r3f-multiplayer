import { useEffect } from "react"
import { useGeckoClient } from "./helpers/useGeckoClient"
import { useEntities } from "../components/entities/useEntities"
import { Path } from "../components/Scene"

type PathMessage = {
  channelId: string
  position: [number, number, number]
  path: Path
}

const isValidPathMessage = (data: unknown): data is PathMessage => {
  if (typeof data !== "object") return false
  if (data === null) return false

  if (!("channelId" in data) || !("position" in data) || !("path" in data)) return false

  if (typeof data.channelId !== "string") return false
  if (!Array.isArray(data.position) || !Array.isArray(data.path)) return false
  if (data.position.length !== 3) return false
  if (data.path.length === 0) return false

  return true
}

const ClientEntityMovement = () => {
  const { on } = useGeckoClient()
  const { entities, forceUpdate } = useEntities()

  useEffect(() => {
    on("setPath", (data) => {
      console.log("got setPath message")
      if (!isValidPathMessage(data)) return
      if (!entities[data.channelId]) return

      entities[data.channelId].position = data.position // should we do this? client side prediction with reconciliation
      entities[data.channelId].path = data.path

      forceUpdate()
    })
  }, [on, entities, forceUpdate])

  return null
}

export default ClientEntityMovement
