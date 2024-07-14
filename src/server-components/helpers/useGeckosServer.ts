import { useContext } from "react"
import { GeckosServerContext } from "./GeckosServerContext"

export const useGeckosServer = () => useContext(GeckosServerContext)
