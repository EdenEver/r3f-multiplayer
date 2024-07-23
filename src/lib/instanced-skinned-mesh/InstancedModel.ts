import * as THREE from "three"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { InstancedAnimator } from "./instanced-animator"
import { useCallback, useEffect, useRef, useState } from "react"
import { Entity } from "r3f-multiplayer"
import { useFrame, useThree } from "@react-three/fiber"

export type InstancedAnimatorOptions = {
  count: number
  viewSensitive: boolean
  instanced: boolean
  minAnimationInterval?: number
  maxAnimationInterval?: number
  maxDistance: number
}

export type InstancedModelProps = {
  modelUrl: string
  options: InstancedAnimatorOptions
  entities: Entity[]
}

// do: make multi-model compatible
// NOTE: do: grow by 2x when full, shrink by 0.5x when 0.25x

const animationFadeFactor = 7.5

export const InstancedModel = ({ options, modelUrl, entities }: InstancedModelProps) => {
  const initialized = useRef(false)

  const [animator, setAnimator] = useState<InstancedAnimator | null>(null)

  const { scene, camera } = useThree()

  const init = useCallback(async () => {
    if (!scene || !camera) return

    const loader = new GLTFLoader()
    const gltf = await loader.loadAsync(modelUrl)

    if (!gltf) return

    const newAnimator = new InstancedAnimator({
      ...options,
      camera,
      gltf,
    })

    setAnimator(newAnimator)

    // do: skip rendering if no entities
    const instance = {
      id: "PLACEHOLDER_TODO_FIX_SO_I_CAN_REMOVE_THIS",
      position: new THREE.Vector3(9999, 9999, 9999),
      rotation: new THREE.Quaternion(),
      scale: new THREE.Vector3(0.001, 0.001, 0.001),
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

    // addInstance(instance)
    newAnimator.addInstance(instance)

    scene.add(newAnimator.group)
  }, [camera, modelUrl, options, scene])

  const cleanUp = useCallback(() => {
    animator && scene.remove(animator.group)
  }, [animator, scene])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    init()

    return () => {
      cleanUp()
    }

    // note: do we need some tear down logic here?
  }, [cleanUp, init])

  useEffect(() => {
    if (!animator) return

    // do: add removeInstance method to animator
    // do: add grow and shrink methods to animator

    const entitiesToAdd = entities.filter(
      (entity) => !animator.instances.some((instance) => instance.id === entity.id)
    )

    const entitiesToRemove = animator.instances.filter(
      (instance) => !entities.some((entity) => entity.id === instance.id)
    )

    entitiesToAdd.forEach((entity) => {
      const instance = {
        id: entity.id,
        position: entity.ref.current?.position.clone() ?? new THREE.Vector3(),
        rotation: entity.ref.current?.quaternion.clone() ?? new THREE.Quaternion(), // not sure if correct
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

      animator?.addInstance(instance)
    })

    entitiesToRemove.forEach((entity) => {
      animator?.removeInstance(entity.id)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animator, entities.length])

  useFrame((_, delta) => {
    if (!animator) return

    animator.update(delta)

    for (const entity of entities) {
      const ref = entity?.ref.current

      if (!ref) continue

      // TODO: create an index for entities for quick lookup
      const instance = animator.instances.find((i) => i.id === entity.id)

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
