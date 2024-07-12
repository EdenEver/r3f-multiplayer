import { Capsule } from "@react-three/drei"
import { useUpdateUnitOnPath } from "../useUpdateUnitOnPath"
import { Entity as EntityType } from "./EntitiesContext"
import { useRef } from "react"
import { Group } from "three"

type Props = {
  entity: EntityType
  serverOnly?: boolean
}

export const Entity = ({ entity }: Props) => {
  const root = useRef<Group | null>(null)

  useUpdateUnitOnPath({ entity, ref: root.current })

  return (
    <>
      <group ref={root} position={[0, 0, 0]}>
        <Capsule args={[1, 2]} position={[0, 1.5, 0]}>
          <meshStandardMaterial color="#f00" />
        </Capsule>
      </group>
    </>
  )
}
