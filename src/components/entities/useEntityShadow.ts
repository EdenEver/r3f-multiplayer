import { useMemo, useEffect } from "react"
import { Color, Mesh, MeshBasicMaterial, MeshStandardMaterial } from "three"

export const useEntityShadow = (nodes: Mesh[], material: MeshStandardMaterial, asShadow?: boolean) => {
  const shadowMaterial = useMemo(() => {
    if (!asShadow) return material

    const shadowMaterial = new MeshBasicMaterial()
    shadowMaterial.color = new Color(0.0025, 0.0025, 0.0025)
    shadowMaterial.depthTest = false

    return shadowMaterial
  }, [asShadow, material])

  useEffect(() => {
    if (asShadow) {
      for (const node of nodes) {
        node.material = shadowMaterial
      }
    } else {
      for (const node of nodes) {
        node.renderOrder = 5
      }
    }
  }, [asShadow, material, nodes, shadowMaterial])

  return { renderOrder: asShadow ? 0 : 5, material: shadowMaterial }
}
