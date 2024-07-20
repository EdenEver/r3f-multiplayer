import { useRef } from "react"

import { Group } from "three"

import { useFrame } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { useOwnEntity } from "../entities/entityHooks"

const shadowMapSize = 1024 // NOTE(Alan): relative to camera size
const shadowCameraSize = 50 // NOTE(Alan): relative to light distance
const lightDistance = 15

const totalLightIntensity = 1
const environmentIntensity = 0.75 // NOTE(Alan): Tweak to alter shadow intensity by relatively changing the directional light intensity

export const Lighting = () => {
  const entity = useOwnEntity()

  const lightTarget = useRef(new Group())

  useFrame(() => {
    if (!entity?.ref.current) return

    lightTarget.current.position.copy(entity.ref.current.position)
  })

  return (
    <>
      <group ref={lightTarget}>
        <directionalLight
          color="#FFE"
          target={lightTarget.current}
          position={[-lightDistance * 0.75, lightDistance * 6, lightDistance * 0.5]}
          intensity={totalLightIntensity - environmentIntensity}
          castShadow
          shadow-bias={-0.0001}
          shadow-mapSize-width={shadowMapSize}
          shadow-mapSize-height={shadowMapSize}
          shadow-camera-near={0}
          shadow-camera-far={200}
          shadow-camera-left={-shadowCameraSize}
          shadow-camera-right={shadowCameraSize}
          shadow-camera-top={shadowCameraSize}
          shadow-camera-bottom={-shadowCameraSize}
        />
      </group>

      <Environment preset="lobby" environmentIntensity={environmentIntensity} />
    </>
  )
}
