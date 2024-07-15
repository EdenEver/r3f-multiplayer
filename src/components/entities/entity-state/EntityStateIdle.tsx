import { useEffect } from "react"
import { useEntityAction } from "../entityHooks"

interface Props {
  id: string
}

export const EntityStateIdle = ({ id }: Props) => {
  const { action, setAction } = useEntityAction(id)

  useEffect(() => {
    if (action !== "Idle") {
      setAction("Idle")
    }
  }, [action, setAction])

  return null
}
