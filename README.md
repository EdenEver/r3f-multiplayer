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
  
## notes

* brave://webrtc-internals/ for debugging webrtc
* avoid cloneDeep for three.js objects (and refs to them)

