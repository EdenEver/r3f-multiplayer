import { useEffect, useState } from "react"
import { AnimationAction } from "three"

type Actions = {
  [x: string]: AnimationAction | null
}

export const useEntityActions = (actions: Actions, action?: keyof Actions) => {
  const [currentAction, setCurrentAction] = useState<keyof Actions>()

  useEffect(() => {
    if (currentAction !== action) {
      if (currentAction && actions[currentAction]) actions[currentAction]?.fadeOut(0.25)
      if (action && actions[action]) actions[action]?.reset().fadeIn(0.25).play()
      // else mixer.stopAllAction()

      setCurrentAction(action)
    }
  }, [actions, action, currentAction])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const a: KnightActionName = "1H_Melee_Attack_Chop"

  //     actions[a]?.reset().fadeIn(0.25)
  //     actions[a]?.play()
  //   }, 2000)

  //   return () => clearInterval(interval)
  // }, [actions])

  return currentAction
}
