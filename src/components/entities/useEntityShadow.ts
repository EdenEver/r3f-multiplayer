import { useMemo, useEffect } from "react"
import { Color, Mesh, MeshStandardMaterial } from "three"

export const useEntityShadow = (nodes: Mesh[], material: MeshStandardMaterial, asShadow?: boolean) => {
  const shadowMaterial = useMemo(() => {
    if (!asShadow) return material

    const shadowMaterial = material.clone()
    // do: flat shading, not working - find a way to render without normals, etc, just the pure, color as in 2D
    shadowMaterial.flatShading = true
    shadowMaterial.color = new Color(0, 0, 0)
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
