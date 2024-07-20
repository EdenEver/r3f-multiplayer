import { PerformanceMonitorApi, usePerformanceMonitor } from "@react-three/drei"
import { Bloom, BrightnessContrast, EffectComposer, N8AO, SMAA } from "@react-three/postprocessing"
import { useCallback, useState } from "react"

export const AfterEffects = () => {
  const [enabled, setEnabled] = useState(true)

  const onChange = useCallback(
    (api: PerformanceMonitorApi) => {
      if (enabled && api.fps < 30) setEnabled(false)
      else if (!enabled && api.fps >= 30) setEnabled(true)
    },
    [enabled]
  )

  usePerformanceMonitor({ onChange })

  // simulation / test / etc
  // const isInsideCave: boolean = false

  return (
    <EffectComposer enabled={enabled}>
      <N8AO aoRadius={60} distanceFalloff={0.08} intensity={5} screenSpaceRadius halfRes />
      <SMAA />
      <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} height={300} opacity={1} />
      {/* {isInsideCave && <Vignette technique={VignetteTechnique.DEFAULT} offset={0.1} darkness={0.75} />} */}
      <BrightnessContrast brightness={0.075} contrast={0.05} />
    </EffectComposer>
  )
}
