import { useEffect } from "react"

import { useUpdateUnitOnPath } from "../../useUpdateUnitOnPath"
import { useEntity, useEntityAction } from "../entityHooks"

type Props = {
  id: string
}

export const EntityStateRunning = ({ id }: Props) => {
  const entity = useEntity(id)

  const { action, setAction } = useEntityAction(id)

  useEffect(() => {
    if (action !== "Running") {
      setAction("Running")
    }
  }, [action, setAction])

  useUpdateUnitOnPath(entity)

  return null
}
