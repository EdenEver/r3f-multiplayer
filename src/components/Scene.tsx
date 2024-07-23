import * as THREE from "three"
import { NavMeshQuery } from "recast-navigation"
import { ThreeEvent, useThree } from "@react-three/fiber"
import { init as initRecast } from "@recast-navigation/core"
import { Capsule, Plane } from "@react-three/drei"
import { suspend } from "suspend-react"

// do: we don't want this circular dependency of the parent component importing the child component
// move to a context or something like that, just a temporary solution
import { NavigationMesh, navmesh } from "./navigation/NavigationMesh"
import { Entity } from "./entities/Entity"
import { useGeckosClient } from "../client-components/helpers/useGeckosClient"
import { useEntitiesList, useEntityIds, useOwnEntity, useUpdateEntity } from "./entities/entityHooks"
import { ServerComponent } from "../server-components/helpers/ServerComponent"
import { ClientComponent } from "../client-components/helpers/ClientComponent"
import { Path, PathMessage } from "r3f-multiplayer"
import { Vector3 } from "three"
import { useCameraFollow } from "./entities/useCameraFollow"
import { OnlyClient } from "./OnlyClient"
import { InstancedAnimatorOptions, InstancedModel } from "../lib/instanced-skinned-mesh/InstancedModel"

type SceneProps = {
  randomSeed: number
  serverOnly?: boolean
}

const options: InstancedAnimatorOptions = {
  count: 100,
  viewSensitive: false,
  instanced: false,
  minAnimationInterval: 30,
  // maxAnimationInterval: 100,
  maxDistance: 140,
}

const Scene = ({ randomSeed }: SceneProps) => {
  const client = useGeckosClient()

  const entity = useOwnEntity()
  const entityIds = useEntityIds()
  const entities = useEntitiesList()
  const updateEntity = useUpdateEntity()

  const onPointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (e.button !== THREE.MOUSE.LEFT) return
    if (!entity?.ref.current) return
    if (!navmesh) return

    const ref = entity.ref.current

    const query = new NavMeshQuery(navmesh)

    const startPosition = ref.position.clone()

    if (!startPosition) return

    const { success, path } = query.computePath(startPosition, e.point)

    if (!success) return

    const newPath: Path = path.map((p) => [p.x, p.y, p.z])

    // NOTE(Alan): Remove close to entity paths to allow repeated clicks with staggered movement
    while (true) {
      if (newPath?.length < 2) break

      const next = new Vector3(...newPath[0])

      if (startPosition.distanceTo(next) >= 0.1) break

      newPath.shift()
    }

    const message: PathMessage = {
      channelId: entity.id,
      position: startPosition.toArray(),
      path: newPath,
    }

    updateEntity({
      id: entity.id,
      path: newPath,
    })

    client.emit("setPath", message)
  }

  useCameraFollow(entity?.ref.current?.position, entity?.ref.current)

  return (
    <>
      <NavigationMesh randomSeed={randomSeed} onClick={onPointerUp}>
        <Plane receiveShadow args={[50, 75]} position-x={-50} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#363" />
        </Plane>

        <Plane receiveShadow args={[50, 25]} position-x={0} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#363" />
        </Plane>

        <Plane receiveShadow args={[50, 75]} position-x={50} rotation={[-Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#363" />
        </Plane>

        <Capsule
          castShadow
          receiveShadow
          args={[2, 4, 8, 32]}
          position={[10, 1, 0]}
          rotation={[-Math.PI / 10, 0, -Math.PI / 10]}
        >
          <meshStandardMaterial color="#b0b" />
        </Capsule>
      </NavigationMesh>

      {entityIds.map((id) => (
        <Entity key={id} id={id} />
      ))}

      <OnlyClient>
        <InstancedModel
          modelUrl="models/knight.glb"
          entities={entities}
          options={options}
        />
      </OnlyClient>

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
