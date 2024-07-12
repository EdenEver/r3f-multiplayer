declare module "r3f-multiplayer" {
  type RpcMessage = Record<string, unknown>

  type Path = [number, number, number][]

  type PathMessage = {
    channelId: string
    position: [number, number, number]
    path: Path
  }

  type Entity = {
    channelId: string
    position: [number, number, number]
    rotationY: number
    path: Path
  }
}
