import { Entity as EntityType } from "r3f-multiplayer"
import { Model as Knight, KnightActionName } from "./Knight"
import { OnlyClient } from "../OnlyClient"
import { EntityState } from "./entity-state/EntityState"
import { useMemo } from "react"

type Props = {
  entity: EntityType
}

/**
 * NOTE: only the last entity gets its initial position set
 * the forceUpdate is not working as expected, should
 * we resort to using position as a state, and update it
 * only when a path is reached (step on path or entire path)?
 * we could update the ref's position intermediately
 * I don't like the forceUpdate, it's a code smell
 * it's working just as good / bad without it
 * entities probably need to be a state, so we can update
 * them and trigger a rerender, so let's keep the entities
 * as states, and add refs to the context for the intermediary
 * position updates
 *
 * entity state = server side state
 * entity ref = client side prediction
 * we send state when it's updated, ie when a new path is set
 * we update refs when the path is being walked, etc.
 *
 * Feels like a good separation of concerns
 *
 * How should we handle interpolation?
 * How should we handle ticks from the server?
 * This cannot reasonably update the state, if it's like 30 FPS
 *
 * do: remove the forceUpdate
 * do: make entities a state
 * do: add refs to the context, use that on the <group> element
 */

// do we need to separate player from rest of entities? Makes sense
export const Entity = ({ entity }: Props) => {
  const action: KnightActionName = useMemo(() => {
    if (!entity?.action) return "Idle"

    if (entity.action === "Running") return "Running_A"
    if (entity.action === "Attacking") return "1H_Melee_Attack_Chop"

    return "Idle"
  }, [entity.action])

  if (!entity) return null
  if (!entity.ref) return null

  return (
    <>
      <group ref={entity.ref} position={entity.ref.current?.position ?? [0, 0, 0]}>
        <OnlyClient>
          <Knight action={action} asShadow />
          <Knight action={action} />
        </OnlyClient>

        <EntityState entity={entity} />
      </group>
    </>
  )
}
