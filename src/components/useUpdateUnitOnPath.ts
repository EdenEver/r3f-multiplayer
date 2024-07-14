import { useRef } from "react"

import { Quaternion, Vector3 } from "three"
import { useFrame } from "@react-three/fiber"
import { Entity } from "r3f-multiplayer"
import { useAddOrUpdateEntity } from "./entities/entityHooks"

const PLAYER_SPEED = 8

const useRefs = () => {
  const next = useRef(new Vector3())
  const direction = useRef(new Vector3())
  const vFrom = useRef(new Vector3(0, 0, 1))
  const vTo = useRef(new Vector3())
  const nextPosition = useRef(new Vector3())
  const turnDirection = useRef(new Quaternion())

  return {
    next: next.current,
    direction: direction.current,
    vFrom: vFrom.current,
    vTo: vTo.current,
    nextPosition: nextPosition.current,
    turnDirection: turnDirection.current,
  }
}

export const useUpdateUnitOnPath = (entity: Entity) => {
  const { next, direction, vFrom, vTo, nextPosition, turnDirection } = useRefs()
  const addOrUpdateEntity = useAddOrUpdateEntity()

  useFrame((_, delta) => {
    if (!entity.ref.current) return

    const ref = entity.ref.current

    const nextEl = entity.path[0]

    if (!nextEl) return

    next.set(...nextEl)

    direction.copy(next).sub(ref.position).normalize()

    vTo.set(direction.x, 0, direction.z).normalize()

    turnDirection.setFromUnitVectors(vFrom, vTo)

    // have player slowly turn towards direction
    ref.quaternion.slerp(turnDirection, delta * 10)

    nextPosition.copy(ref.position).add(direction.multiplyScalar(delta * PLAYER_SPEED))

    ref.position.lerp(nextPosition, 1.1)

    if (ref.position.distanceTo(next) < 0.1) {
      addOrUpdateEntity({
        id: entity.id,
        path: entity.path.length > 0 ? entity.path.slice(1) : [],
      })
    }
  })
}
