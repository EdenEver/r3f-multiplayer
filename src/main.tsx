import "./index.css"

import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import { GeckoClientProvider } from "./client-components/helpers/GeckoClientContext"
import { EntitiesProvider } from "./components/entities/EntitiesContext"

// do: add back strict mode after fixing the double connection issue

// <React.StrictMode>
// </React.StrictMode>

ReactDOM.createRoot(document.getElementById("root")!).render(
  <EntitiesProvider>
    <GeckoClientProvider>
      <App />
    </GeckoClientProvider>
  </EntitiesProvider>
)
