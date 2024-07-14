import { RpcMessage, PathMessage, EntityMessage } from "r3f-multiplayer"

export const isValidRpcMessage = (data: unknown): data is RpcMessage =>
  typeof data === "object" && data !== null

export type SetEntitiesMessage = {
  entities: EntityMessage[]
}

export const isValidSetEntitiesMessage = (data: unknown): data is SetEntitiesMessage =>
  isValidRpcMessage(data) && "entities" in data && Array.isArray(data.entities)

export const isValidPlayerConnectedMessage = (data: unknown): data is RpcMessage & EntityMessage =>
  isValidRpcMessage(data) &&
  "channelId" in data &&
  "position" in data &&
  "rotationY" in data &&
  "path" in data

export const isValidPlayerDisconnectedMessage = (data: unknown): data is RpcMessage & EntityMessage =>
  isValidRpcMessage(data) && "channelId" in data

export const isValidPathMessage = (data: unknown): data is PathMessage => {
  if (typeof data !== "object") return false
  if (data === null) return false

  if (!("channelId" in data) || !("position" in data) || !("path" in data)) return false

  if (typeof data.channelId !== "string") return false
  if (!Array.isArray(data.position) || !Array.isArray(data.path)) return false
  if (data.position.length !== 3) return false
  if (data.path.length === 0) return false

  return true
}
