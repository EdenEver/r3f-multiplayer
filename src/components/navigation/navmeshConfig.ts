import {
  SoloNavMeshGeneratorConfig,
  TiledNavMeshGeneratorConfig,
  TileCacheGeneratorConfig,
} from "recast-navigation/generators"

type NavMeshConfig =
  | Partial<SoloNavMeshGeneratorConfig>
  | Partial<TiledNavMeshGeneratorConfig>
  | Partial<TileCacheGeneratorConfig>

export const navMeshConfig: NavMeshConfig = {
  cs: 0.2,
  ch: 0.2,
  walkableSlopeAngle: 50,
  walkableHeight: 5,
  walkableClimb: 3,
  walkableRadius: 1,
  maxEdgeLen: 12,
  maxSimplificationError: 1.3,
  minRegionArea: 8,
  mergeRegionArea: 20,
  maxVertsPerPoly: 6,
  detailSampleDist: 6,
  detailSampleMaxError: 1,
}
