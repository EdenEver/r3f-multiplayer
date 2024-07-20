import { Suspense, useState } from "react"
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Bvh,
  OrbitControls,
  PerformanceMonitor,
  Preload,
} from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Scene } from "./components/Scene"
import { CAMERA_NEAR, CAMERA_OFFSET, CAMERA_ZOOM } from "./components/constants"
import { Perf } from "r3f-perf"
import { Visuals } from "./components/Visuals/Visuals"
import { OnlyClient } from "./components/OnlyClient"

const randomSeed = Number.parseInt(import.meta.env.RANDOM_SEED ?? "42")

function App() {
  const [, setDpr] = useState(1.5)
  const [serverOnly, setServerOnly] = useState(false)

  return (
    <>
      <div className="z-10 absolute bottom-1 right-1 m-2">
        <div className="flex flex-col gap-2">
          <button
            className="bg-white rounded border border-slate-600 py-1 px-2"
            onClick={() => setServerOnly((s) => !s)}
          >
            {serverOnly ? "Server Only" : "Client and Server"}
          </button>
        </div>
      </div>

      <Canvas
        // dpr={dpr} // NOTE(Alan): This messes SA8O up
        frameloop="always"
        className="w-screen h-screen"
        style={{ background: "#222", height: "100%" }}
        shadows
        orthographic
        camera={{
          zoom: CAMERA_ZOOM,
          near: CAMERA_NEAR,
          position: CAMERA_OFFSET,
        }}
      >
        <PerformanceMonitor
          flipflops={3}
          factor={1}
          onChange={({ factor }) => setDpr(Math.floor(0.5 + 1.5 * factor))}
        >
          <Suspense>
            <Bvh firstHitOnly>
              <Scene randomSeed={randomSeed} serverOnly={serverOnly} />
            </Bvh>

            <OnlyClient>
              <AdaptiveDpr pixelated />
              <AdaptiveEvents />
              <Preload all />
            </OnlyClient>
          </Suspense>
          <Visuals />

          <OrbitControls enableRotate={false} />

          <OnlyClient>
            <Perf />
          </OnlyClient>
        </PerformanceMonitor>
      </Canvas>
    </>
  )
}

export default App
