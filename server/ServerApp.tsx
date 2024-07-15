import { StrictMode } from "react"
import { Scene } from "../src/components/Scene"
import { EntitiesProvider } from "../src/components/entities/EntitiesContext"
import { GeckosServerProvider } from "../src/server-components/helpers/GeckosServerContext"

const randomSeed = Number.parseInt(process.env.RANDOM_SEED ?? "42")

export const ServerApp = () => (
  <StrictMode>
    <EntitiesProvider>
      <GeckosServerProvider>
        <Scene randomSeed={randomSeed} />
      </GeckosServerProvider>
    </EntitiesProvider>
  </StrictMode>
)
