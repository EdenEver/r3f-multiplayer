import { useContext } from "react"
import { GeckoServerContext } from "./GeckoServerContext"

export const useGeckoServer = () => useContext(GeckoServerContext)
