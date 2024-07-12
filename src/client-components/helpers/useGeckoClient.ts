import { useContext } from "react"
import { GeckoClientContext } from "./GeckoClientContext"

export const useGeckoClient = () => useContext(GeckoClientContext)
