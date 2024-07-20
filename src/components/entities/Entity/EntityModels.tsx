import { useGLTF } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useCallback, useEffect, useRef, useState } from "react"
import * as THREE from "three"
import {
  AnimatedInstance,
  ViewSensitiveInstancedAnimator as Animator,
  install,
} from "three-instanced-animation"
import { useEntitiesList } from "../entityHooks"
import { CAMERA_DISTANCE } from "../../constants"

declare global {
  // eslint-disable-next-line no-var
  var three_instanced_animation_installed: boolean
}

if (globalThis.three_instanced_animation_installed !== true) {
  globalThis.three_instanced_animation_installed = true

  THREE.ShaderChunk.morphinstance_vertex = /* glsl */ `
    #ifdef MORPHTARGETS_COUNT
      ${THREE.ShaderChunk.morphinstance_vertex}
    #endif
  `

  install(THREE)
}

// const extractAnimationNames = (gltf: ReturnType<typeof useGLTF>): string[] => {
//   if (Array.isArray(gltf)) {
//     return gltf.flatMap(extractAnimationNames)
//   }

//   return gltf.animations.map((animation) => animation.name)
// }

// note: view sensitivity does not work with orthographic camera
// do: when lifting out, enable shadow casting / receiving

const animationFadeFactor = 7.5

export const EntityModels = () => {
  const entities = useEntitiesList()
  const gltf = useGLTF("/models/knight.glb")

  const { scene, camera } = useThree()

  const initialized = useRef(false)

  const [instances, setInstances] = useState<Record<string, AnimatedInstance>>({})
  const [animator, setAnimator] = useState<Animator | null>(null)

  const init = useCallback(
    async (scene?: THREE.Scene | null, camera?: THREE.Camera | null) => {
      if (!scene || !camera) return

      if (initialized.current) return
      initialized.current = true

      // do: make props
      const animator = new Animator({
        gltf,
        count: 100,
        camera,
        // NOTE: update rate when the instance is at `maxDistance`
        // maxAnimationInterval: 1000 / 60,
        // NOTE: update rate when the instance is at front of the camera
        minAnimationInterval: 1000 / 10,
        // NOTE: the distance at which the instance will be updated at `maxAnimationInterval`
        maxDistance: CAMERA_DISTANCE * 3, //80,
      })

      const instances: Record<string, AnimatedInstance> = {}

      for (const entity of entities) {
        if (!entity) continue

        const position = entity.startingPosition
          ? new THREE.Vector3(...entity.startingPosition)
          : new THREE.Vector3()

        const instance: AnimatedInstance = {
          position,
          rotation: new THREE.Quaternion(),
          scale: new THREE.Vector3(1, 1, 1),
          animations: {
            Idle: {
              time: 0,
              weight: 1,
            },
            Running_A: {
              time: 0,
              weight: 0,
            },
          },
        }

        instances[entity.id] = instance

        animator.addInstance(instance)
      }

      setInstances(instances)
      setAnimator(animator)

      scene.add(animator.group)
    },
    [entities, gltf]
  )

  useEffect(() => {
    init(scene, camera)
  }, [scene, camera, init])

  useFrame((_, delta) => {
    if (!animator) return

    animator.update(delta)

    for (const entity of entities) {
      const ref = entity?.ref.current

      if (!ref) continue

      const instance = instances[entity.id]

      if (!instance) continue

      instance.position.copy(ref.position)
      instance.rotation.copy(ref.quaternion)

      // do: generalize
      if (entity.action === "Idle") {
        if (instance.animations["Idle"].weight < 1)
          instance.animations["Idle"].weight += delta * animationFadeFactor
        if (instance.animations["Running_A"].weight > 0)
          instance.animations["Running_A"].weight -= delta * animationFadeFactor
      } else if (entity.action === "Running") {
        if (instance.animations["Running_A"].weight < 1)
          instance.animations["Running_A"].weight += delta * animationFadeFactor
        if (instance.animations["Idle"].weight > 0)
          instance.animations["Idle"].weight -= delta * animationFadeFactor
      }
    }
  })

  return null
}
