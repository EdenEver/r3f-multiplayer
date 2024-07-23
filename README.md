# R3F Multiplayer

A project showing how to do a multiplayer game with react-three-fiber and geckos.io. The unique aspect of this project is that it uses a single codebase for both the client and the server. The server is a node.js server that runs the same code as the client, but with a different entry point, that is the React application is running on th server, using @react-three/test-rendering.

## IN PROGRESS


**OBS!! This project is in progress and is not yet ready for use.**

# todo

* relative paths to components folder (server-components, client-components) in the vite config
  * fix vite build with dynamic paths (there is a plugin for this)
* make server-side hot reloading ignore client-components
* make client-side hot reloading ignore server-components
* better devx for client / server cmponents
  * I would like to make this 100% declarative with no need for dynamic imports, etc
  * client / server specific components should only handle communication with the client / server in an idiomatic app though. States etc should be shared by the two.
* Add client button to send a debug snapshot message to the server, which will to a `toJSON` on the server scene / state and send it back to the client and save it to file
* server stopped picking up / saving entities, only the last is persisted, or something like that
  * should mean that this is happening in the geckos server context


* There is a consistent problem with having everything being refs, this is a core issue, need to figure out how to keep things that need to be updated on a per-frame basis as refs, but everything else as state.
  * we probably need to move player out of the entities context
  * there is no problem with re-rendering components somewhat often, just not per-frame

## Instanced Rendering

* integrate instances rendering solution based on https://github.com/luis-herasme/instanced-skinned-mesh
* make it a R3F component
* fix duplicate versions of THREE imports
* fix shader issues with MORPHTARGETS_COUNT
* separate animation update loop from other logic (placement, etc)
  * update animations based on distance from camera (zoom) since this is the performance bottleneck
* make shadow casting / receiving work
* automatic growth * 2 of instances buffer when entities > max size
* automatic shrink if entities < max size / 2
* make sure that the entities are not updated if they are not visible (+ visual culling) 

## notes

* brave://webrtc-internals/ for debugging webrtc
* avoid cloneDeep for three.js objects (and refs to them)

## References on Performance / Instanced Rendering

* https://x.com/Cody_J_Bennett/status/1802173939583463676
* https://github.com/luis-herasme/instanced-skinned-mesh?tab=readme-ov-file
  * https://instanced-animation.vercel.app/
* https://github.com/wizgrav/cl2
* https://vkguide.dev/docs/gpudriven
* https://github.com/CodyJasonBennett/gpu-culling
* https://github.com/mrdoob/three.js/pull/28534
* https://github.com/mrdoob/three.js/pull/28533
* https://github.com/mrdoob/three.js/pull/26160
* https://codesandbox.io/s/2yfgiu?file=/whale.gltf
* https://github.com/mrdoob/three.js/pull/22667
* https://github.com/notifications



### other stuff

* import three as "import * as THREE from 'three';" to avoid name conflicts and seems to be standard


### todo list

1. import skinned animated instancing from /lib
2. get rid of "multiple instances of THREE.js is being imported" warning1