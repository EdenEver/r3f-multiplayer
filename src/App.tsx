import { useState } from "react"
import { Environment, OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Scene } from "./components/Scene"
import { CAMERA_NEAR, CAMERA_OFFSET, CAMERA_ZOOM } from "./components/constants"
import { Lighting } from "./components/Lighting"

const randomSeed = Number.parseInt(import.meta.env.RANDOM_SEED ?? "42")

function App() {
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
        <Lighting />

        <Scene randomSeed={randomSeed} serverOnly={serverOnly} />

        <OrbitControls enableRotate={false} />
      </Canvas>
    </>
  )
}

export default App
