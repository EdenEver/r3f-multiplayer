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
  }

  type EntityMessage = {
    channelId: EntityId
    position: Position
    rotationY: number
    path: Path
  }

  type EntityState = {
    id: EntityId
    position?: Position
    rotationY?: number
    path?: Path
  }
}
