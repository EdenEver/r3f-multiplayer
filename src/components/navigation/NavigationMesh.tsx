import { threeToSoloNavMesh } from "@recast-navigation/three"
import { PropsWithChildren, useLayoutEffect, useRef } from "react"
import { NavMesh, setRandomSeed } from "recast-navigation"
import { Group, Mesh } from "three"
import { navMeshConfig } from "./navmeshConfig"
import { ThreeEvent } from "@react-three/fiber"

export let navmesh: NavMesh | null = null

type Props = PropsWithChildren<{
  randomSeed: number
  onClick?: (e: ThreeEvent<PointerEvent>) => void
}>

export const NavigationMesh = ({ children, randomSeed, onClick }: Props) => {
  const root = useRef<Group>(null)

  useLayoutEffect(() => {
    const meshes: Mesh[] = []

    root.current?.traverse((child) => {
      if (child.type === "Mesh") {
        meshes.push(child as Mesh)
      }
    })

    const res = threeToSoloNavMesh(meshes, navMeshConfig)

    if (res.success) {
      navmesh = res.navMesh

      setRandomSeed(randomSeed)
    }
  }, [randomSeed])

  return (
    <group ref={root} onPointerUp={onClick}>
      {children}
    </group>
  )
}
