import { useContext } from "react"
import { GeckosClientContext } from "./GeckosClientContext"

export const useGeckosClient = () => useContext(GeckosClientContext)
