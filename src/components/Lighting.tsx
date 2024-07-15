import { useRef } from "react"

import { Group } from "three"

import { useFrame } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import { useRerenderOnMount } from "./utils/useRerenderOnMount"
import { useOwnEntity } from "./entities/entityHooks"

const shadowMapSize = 2048
const shadowCameraSize = 75

export const Lighting = () => {
  useRerenderOnMount()

  const entity = useOwnEntity()

  const lightTarget = useRef(new Group())

  useFrame(() => {
    if (!entity?.ref.current) return

    lightTarget.current.position.copy(entity.ref.current.position)
  })

  return (
    <>
      {/* <ambientLight intensity={1} rotation-x={5} /> */}
      {/* <hemisphereLight intensity={1} groundColor={"#080820"} position={[0, 5, 0]} /> */}

      <group ref={lightTarget}>
        <directionalLight
          color="#FFE"
          target={lightTarget.current}
          position={[0, 8, 0]}
          intensity={1}
          castShadow
          shadow-bias={-0.0001}
          shadow-mapSize-width={shadowMapSize}
          shadow-mapSize-height={shadowMapSize}
          shadow-camera-near={0.1}
          shadow-camera-far={10}
          shadow-camera-left={-shadowCameraSize}
          shadow-camera-right={shadowCameraSize}
          shadow-camera-top={shadowCameraSize}
          shadow-camera-bottom={-shadowCameraSize}
        />

        <Environment preset="forest" environmentIntensity={0.5} />
      </group>
    </>
  )
}
