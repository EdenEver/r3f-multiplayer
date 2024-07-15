import { OnlyClient } from "../OnlyClient"
import { AfterEffects } from "./AfterEffects"
import { Lighting } from "./Lighting"

export const Visuals = () => (
  <OnlyClient>
    <Lighting />
    <AfterEffects />
  </OnlyClient>
)
