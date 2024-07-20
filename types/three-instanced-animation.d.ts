declare module "three-instanced-animation" {
  import { useGLTF } from "@react-three/drei"
  import * as THREE_TYPE from "three"

  type Install = (THREE: THREE_TYPE) => void

  const install: Install

  type Options = {
    gltf: ReturnType<typeof useGLTF>
    count: number
    camera: THREE_TYPE.Camera
    maxAnimationInterval?: number
    minAnimationInterval: number
    maxDistance: number
  }

  type InstanceAnimation = {
    time: number
    weight: number
  }

  type AnimatedInstance = {
    position: THREE_TYPE.Vector3
    rotation: THREE_TYPE.Quaternion
    scale: THREE_TYPE.Vector3
    animations: Record<string, InstanceAnimation>
  }

  class ViewSensitiveInstancedAnimator {
    group: THREE_TYPE.Group
    
    constructor(options: Options)

    addInstance(instance: Instance): void

    update(deltaTime: number): void
  }
}
