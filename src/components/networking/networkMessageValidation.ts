import { Entity, RpcMessage, PathMessage } from "r3f-multiplayer"

export const isValidRpcMessage = (data: unknown): data is RpcMessage =>
  typeof data === "object" && data !== null

export const isValidSetEntitiesMessage = (data: unknown): data is { entities: { [key in string]: Entity } } =>
  isValidRpcMessage(data) && "entities" in data && typeof data.entities === "object"

export const isValidPlayerConnectedMessage = (data: unknown): data is RpcMessage & Entity =>
  isValidRpcMessage(data) &&
  "channelId" in data &&
  "position" in data &&
  "rotationY" in data &&
  "path" in data

export const isValidPlayerDisconnectedMessage = (data: unknown): data is RpcMessage & Entity =>
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
