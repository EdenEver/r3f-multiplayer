type Callback = (framesToAdvance: number, delta: number) => void

const framesToAdvance = 1

const getTimeout = (fps: number, delta: number) => Math.max(1000 / fps - delta, 0)

let now = 0
let last = 0
let delta = 0

export const loop = (fps = 30, cb: Callback = () => {}) => {
  const doWork = () => {
    now = performance.now()
    delta = now - last
    last = now

    cb(framesToAdvance, delta / 1000)

    setTimeout(doWork, getTimeout(fps, delta))
  }

  doWork()
}
