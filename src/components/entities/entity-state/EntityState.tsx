import { useEffect } from "react"

import { useActor } from "@xstate/react"
import { Entity } from "r3f-multiplayer"

import { EntityStateIdle } from "./EntityStateIdle"
import { EntityStateRunning } from "./EntityStateRunning"
import { playerStateMachine } from "./playerStateMachine"

type Props = {
  entity: Entity
}

export const EntityState = ({ entity }: Props) => {
  const path = entity.path

  const [state, send] = useActor(playerStateMachine)

  useEffect(() => {
    if (path.length > 0) {
      send({ type: "RUN" })
      return
    }

    send({ type: "STOP" })
  }, [path, send])

  if (state.matches("idle")) return <EntityStateIdle id={entity.id} />
  if (state.matches("running")) return <EntityStateRunning id={entity.id} />

  return null
}
