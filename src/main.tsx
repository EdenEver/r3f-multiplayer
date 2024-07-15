import "./index.css"

import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { GeckosClientProvider } from "./client-components/helpers/GeckosClientContext"
import { EntitiesProvider } from "./components/entities/EntitiesContext"
import App from "./App"

// do: strict mode causing two entities to be created in the client - guard against this

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EntitiesProvider>
      <GeckosClientProvider>
        <App />
      </GeckosClientProvider>
    </EntitiesProvider>
  </StrictMode>
)
