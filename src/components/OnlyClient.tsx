import { PropsWithChildren, useEffect, useState } from "react"

export const OnlyClient = (props: PropsWithChildren) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") setIsClient(true)
  }, [])

  if (!isClient) return null

  return <>{props.children}</>
}
