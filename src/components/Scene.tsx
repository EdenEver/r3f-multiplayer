import * as THREE from "three"
import { NavMeshQuery } from "recast-navigation"
import { ThreeEvent } from "@react-three/fiber"
import { init as initRecast } from "@recast-navigation/core"
import { Plane } from "@react-three/drei"
import { suspend } from "suspend-react"

// do: we don't want this circular dependency of the parent component importing the child component
// move to a context or something like that, just a temporary solution
import { NavigationMesh, navmesh } from "./navigation/NavigationMesh"
import { Entity } from "./entities/Entity"
import { useGeckoClient } from "../client-components/helpers/useGeckoClient"
import { useEntities, useOwnEntity } from "./entities/useEntities"
import { ServerComponent } from "../server-components/helpers/ServerComponent"
import { ClientComponent } from "../client-components/helpers/ClientComponent"
import { Path, PathMessage } from "r3f-multiplayer"

type SceneProps = {
  randomSeed: number
  serverOnly?: boolean
}

const Scene = ({ randomSeed }: SceneProps) => {
  const entity = useOwnEntity()
  const { entities } = useEntities()
  const client = useGeckoClient()

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (e.button !== THREE.MOUSE.LEFT) return
    if (!entity) return
    if (!navmesh) return

    const query = new NavMeshQuery(navmesh)

    const startPosition = entity.position

    if (!startPosition) return

    const { success, path } = query.computePath(new THREE.Vector3(...startPosition), e.point)

    if (success) {
      const newPath: Path = path.map((p) => [p.x, p.y, p.z])

      entity.path = newPath

      const message: PathMessage = {
        channelId: entity.channelId,
        position: startPosition,
        path: newPath,
      }

      client.emit("setPath", message)
    }
  }

  return (
    <>
      <NavigationMesh randomSeed={randomSeed} onClick={onPointerUp}>
        <Plane args={[50, 75]} position-x={-50} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#363" />
        </Plane>

        <Plane args={[50, 25]} position-x={0} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#363" />
        </Plane>

        <Plane args={[50, 75]} position-x={50} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#363" />
        </Plane>
      </NavigationMesh>

      {Object.entries(entities).map(([key, entity]) => (
        <Entity key={key} entity={entity} />
      ))}

      <ServerComponent component="ServerEntityMovement" entity={entity} />

      <ClientComponent component="ClientEntityMovement" />
    </>
  )
}

const RecastInit = (props: { children: JSX.Element }) => {
  suspend(() => initRecast(), [])

  return props.children
}

// do: we would like to wrap the Scene component with the EntitiesProvider but we need to access it in the
// client and server context's as well, so it needs to go there for now
// I guess it's not the end of the world, but it's not ideal

const SceneWrapper = (props: SceneProps) => (
  <RecastInit>
    <Scene {...props} />
  </RecastInit>
)

export { SceneWrapper as Scene }
