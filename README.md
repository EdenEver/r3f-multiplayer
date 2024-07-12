# todo

* make server-side hot reloading ignore client-components
* make client-side hot reloading ignore server-components
* fix vite build with dynamic paths (there is a plugin for this)
* better devx for client / server cmponents
  * I would like to make this 100% declarative with no need for dynamic imports, etc
  * client / server specific components should only handle communication with the client / server in an idiomatic app though. States etc should be shared by the two.
* Add client button to send a debug snapshot message to the server, which will to a `toJSON` on the server scene / state and send it back to the client and save it to file




## notes

* brave://webrtc-internals/ for debugging webrtc