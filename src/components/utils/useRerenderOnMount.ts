import { useEffect } from "react"

import { useRerender } from "./useRerender"

export const useRerenderOnMount = () => {
  const rerender = useRerender()

  useEffect(() => {
    rerender()
  }, [rerender])
}
