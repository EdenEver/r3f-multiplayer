import React from "react"
import * as THREE from "three"
import { extend } from "@react-three/fiber"
import ReactThreeTestRenderer from "@react-three/test-renderer"

import { ServerApp } from "./ServerApp"
import { loop } from "./loop"

extend(THREE)

const run = async () => {
  const renderer = await ReactThreeTestRenderer.create(<ServerApp />)

  loop(30, renderer.advanceFrames)
}

run()
