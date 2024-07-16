declare module "r3f-multiplayer" {
  import { MutableRefObject } from "react"
  import { Group } from "three"

  type RpcMessage = Record<string, unknown>

  type Position = [number, number, number]

  type Path = Position[]

  type PathMessage = {
    channelId: string
    position: Position
    path: Path
  }

  type EntityId = string

  type Entity = {
    id: EntityId
    path: Path
    ref: MutableRefObject<Group | null>
    action: "Idle" | "Running" | "Attacking"
  }

  type EntityMessage = {
    channelId: EntityId
    position: Position
    rotationY: number
    path: Path
  }

  type EntityBaseState = {
    id: EntityId
  }

  type EntityStateData = {
    position: Position
    rotationY: number
    action: Entity["action"]
    path: Path
  }

  type PartialEntityState = EntityBaseState & Partial<EntityStateData>

  type FullEntityState = EntityBaseState & EntityStateData
}
