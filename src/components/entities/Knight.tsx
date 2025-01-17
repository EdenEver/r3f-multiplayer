/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.15 models/knight.glb -t -s -r public/ -o ./src/components/entities/Knight.tsx 
*/

import { FC, useMemo, useRef } from "react"

import * as THREE from "three"
import { GLTF, SkeletonUtils } from "three-stdlib"
import { useGraph } from "@react-three/fiber"
import { useGLTF, useAnimations } from "@react-three/drei"

import { useEntityActions } from "./useEntityActions"
import { useEntityShadow } from "./useEntityShadow"

type GLTFResult = GLTF & {
  nodes: {
    Badge_Shield: THREE.Mesh
    ["1H_Sword"]: THREE.Mesh
    Knight_Helmet: THREE.Mesh
    Knight_Cape: THREE.Mesh
    Knight_ArmLeft: THREE.SkinnedMesh
    Knight_ArmRight: THREE.SkinnedMesh
    Knight_Body: THREE.SkinnedMesh
    Knight_Head: THREE.SkinnedMesh
    Knight_LegLeft: THREE.SkinnedMesh
    Knight_LegRight: THREE.SkinnedMesh
    root: THREE.Bone
  }
  materials: {
    knight_texture: THREE.MeshStandardMaterial
  }
}

export type KnightActionName =
  | "1H_Melee_Attack_Chop"
  | "1H_Melee_Attack_Slice_Diagonal"
  | "1H_Melee_Attack_Slice_Horizontal"
  | "1H_Melee_Attack_Stab"
  | "1H_Ranged_Aiming"
  | "1H_Ranged_Reload"
  | "1H_Ranged_Shoot"
  | "1H_Ranged_Shooting"
  | "2H_Melee_Attack_Chop"
  | "2H_Melee_Attack_Slice"
  | "2H_Melee_Attack_Spin"
  | "2H_Melee_Attack_Spinning"
  | "2H_Melee_Attack_Stab"
  | "2H_Melee_Idle"
  | "2H_Ranged_Aiming"
  | "2H_Ranged_Reload"
  | "2H_Ranged_Shoot"
  | "2H_Ranged_Shooting"
  | "Block_Attack"
  | "Block_Hit"
  | "Block"
  | "Blocking"
  | "Cheer"
  | "Death_A_Pose"
  | "Death_A"
  | "Death_B_Pose"
  | "Death_B"
  | "Dodge_Backward"
  | "Dodge_Forward"
  | "Dodge_Left"
  | "Dodge_Right"
  | "Dualwield_Melee_Attack_Chop"
  | "Dualwield_Melee_Attack_Slice"
  | "Dualwield_Melee_Attack_Stab"
  | "Hit_A"
  | "Hit_B"
  | "Idle"
  | "Interact"
  | "Jump_Full_Long"
  | "Jump_Full_Short"
  | "Jump_Idle"
  | "Jump_Land"
  | "Jump_Start"
  | "Lie_Down"
  | "Lie_Idle"
  | "Lie_Pose"
  | "Lie_StandUp"
  | "PickUp"
  | "Running_A"
  | "Running_B"
  | "Running_Strafe_Left"
  | "Running_Strafe_Right"
  | "Sit_Chair_Down"
  | "Sit_Chair_Idle"
  | "Sit_Chair_Pose"
  | "Sit_Chair_StandUp"
  | "Sit_Floor_Down"
  | "Sit_Floor_Idle"
  | "Sit_Floor_Pose"
  | "Sit_Floor_StandUp"
  | "Spellcast_Long"
  | "Spellcast_Raise"
  | "Spellcast_Shoot"
  | "Spellcasting"
  | "T-Pose"
  | "Throw"
  | "Unarmed_Idle"
  | "Unarmed_Melee_Attack_Kick"
  | "Unarmed_Melee_Attack_Punch_A"
  | "Unarmed_Melee_Attack_Punch_B"
  | "Unarmed_Pose"
  | "Use_Item"
  | "Walking_A"
  | "Walking_B"
  | "Walking_Backwards"
  | "Walking_C"

type Props = JSX.IntrinsicElements["group"] & {
  action?: KnightActionName
  asShadow?: boolean
}

export const Model: FC<Props> = ({ action, asShadow, ...props }) => {
  const group = useRef<THREE.Group>(null!)

  const { scene, materials, animations } = useGLTF("models/knight.glb") as GLTFResult
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const graph = useGraph(clone)
  const nodes = graph.nodes as GLTFResult["nodes"]
  const { actions } = useAnimations(animations, group)

  useEntityActions(actions, action)

  const entityShadow = useEntityShadow(
    [nodes["1H_Sword"], nodes.Badge_Shield, nodes.Knight_Helmet, nodes.Knight_Cape],
    materials.knight_texture,
    asShadow
  )

  return (
    <group ref={group} {...props} dispose={null} receiveShadow>
      <group name="Scene">
        <group name="Rig">
          <primitive object={nodes.root} />

          <skinnedMesh
            castShadow
            receiveShadow
            name="Knight_ArmLeft"
            geometry={nodes.Knight_ArmLeft.geometry}
            skeleton={nodes.Knight_ArmLeft.skeleton}
            {...entityShadow}
          />
          <skinnedMesh
            castShadow
            receiveShadow
            name="Knight_ArmRight"
            geometry={nodes.Knight_ArmRight.geometry}
            skeleton={nodes.Knight_ArmRight.skeleton}
            {...entityShadow}
          />
          <skinnedMesh
            castShadow
            receiveShadow
            name="Knight_Body"
            geometry={nodes.Knight_Body.geometry}
            skeleton={nodes.Knight_Body.skeleton}
            {...entityShadow}
          />
          <skinnedMesh
            castShadow
            receiveShadow
            name="Knight_Head"
            geometry={nodes.Knight_Head.geometry}
            skeleton={nodes.Knight_Head.skeleton}
            {...entityShadow}
          />
          <skinnedMesh
            castShadow
            receiveShadow
            name="Knight_LegLeft"
            geometry={nodes.Knight_LegLeft.geometry}
            skeleton={nodes.Knight_LegLeft.skeleton}
            {...entityShadow}
          />
          <skinnedMesh
            castShadow
            receiveShadow
            name="Knight_LegRight"
            geometry={nodes.Knight_LegRight.geometry}
            skeleton={nodes.Knight_LegRight.skeleton}
            {...entityShadow}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload("models/knight.glb")
