import { PropsWithChildren } from "react"
import { init as initRecast } from "@recast-navigation/core"
import { suspend } from "suspend-react"

const RecastInit = (props: PropsWithChildren) => {
  suspend(() => initRecast(), [])

  return props.children
}

export const WithRecast = (props: PropsWithChildren) => <RecastInit>{props.children}</RecastInit>
