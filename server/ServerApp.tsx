import { Scene } from "../src/components/Scene"
import { EntitiesProvider } from "../src/components/entities/EntitiesContext"
import { GeckoServerProvider } from "../src/server-components/helpers/GeckoServerContext"

const randomSeed = Number.parseInt(process.env.RANDOM_SEED ?? "42")

export const ServerApp = () => (
  <EntitiesProvider>
    <GeckoServerProvider>
      <Scene randomSeed={randomSeed} />
    </GeckoServerProvider>
  </EntitiesProvider>
)
