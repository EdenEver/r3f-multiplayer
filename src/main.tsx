import "./index.css"

import ReactDOM from "react-dom/client"
import App from "./App"
import { GeckosClientProvider } from "./client-components/helpers/GeckosClientContext"
import { EntitiesProvider } from "./components/entities/EntitiesContext"

// do: add back strict mode after fixing the double connection issue

// <React.StrictMode>
// </React.StrictMode>

ReactDOM.createRoot(document.getElementById("root")!).render(
  <EntitiesProvider>
    <GeckosClientProvider>
      <App />
    </GeckosClientProvider>
  </EntitiesProvider>
)
