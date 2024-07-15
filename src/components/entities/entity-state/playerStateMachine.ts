import { AnyEventObject, createMachine } from "xstate"

export type Send = (event: AnyEventObject) => void

export const playerStateMachine = createMachine({
  id: "player-state",
  initial: "idle",
  states: {
    idle: {
      on: {
        RUN: "running",
      },
    },
    running: {
      on: {
        STOP: "idle",
      },
    },
  },
})
