import { lazy, useEffect, useState } from "react"

type Dictionary = { [key in string]: unknown }

export const ServerComponent = ({ component, ...props }: { component: string } & Dictionary) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") {
      setComponent(lazy(() => import(`../${component}.tsx`)))
    }
  }, [component])

  return Component && <Component {...props} />
}
