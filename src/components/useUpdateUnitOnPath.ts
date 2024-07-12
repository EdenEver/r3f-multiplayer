import { useRef } from "react"

import { Group, Object3DEventMap, Quaternion, Vector3 } from "three"
import { useFrame } from "@react-three/fiber"
import { Entity } from "r3f-multiplayer"

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

type Args = {
  entity: Entity
  ref: Group<Object3DEventMap> | null
}

export const useUpdateUnitOnPath = ({ entity, ref }: Args) => {
  const { next, direction, vFrom, vTo, nextPosition, turnDirection } = useRefs()

  useFrame((_, delta) => {
    console.log("running on the server?")
    if (!entity || !ref) return

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

    const position: [number, number, number] = [ref.position.x, ref.position.y, ref.position.z]
    const rotation: [number, number, number] = [ref.rotation.x, ref.rotation.y, ref.rotation.z]

    entity.position = position
    entity.rotationY = rotation[1]

    if (ref.position.distanceTo(next) < 0.1) {
      entity.path = entity.path.length > 0 ? entity.path.slice(1) : []
    }
  })
}
