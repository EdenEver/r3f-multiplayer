import { useRef } from "react"

import { Group, Vector3 } from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { CAMERA_OFFSET } from "../constants"
import { useRerenderOnEntitiesUpdate } from "./entityHooks"

const cameraTargetPosition = new Vector3()

export const useCameraFollow = (startPosition: Vector3 = new Vector3(), ref: Group | null | undefined) => {
  useRerenderOnEntitiesUpdate()

  const { camera } = useThree()
  const cameraTarget = useRef<Vector3>(startPosition.clone().add(new Vector3(0, 0.2, 0)))

  useFrame(() => {
    if (!ref) return

    // NOTE Assuming the camera is direct child of the Scene
    ref.getWorldPosition(cameraTargetPosition)

    cameraTarget.current.lerp(cameraTargetPosition, 0.1)
    camera.position.copy(cameraTarget.current).add(CAMERA_OFFSET)
    camera.lookAt(cameraTarget.current)
  })
}
