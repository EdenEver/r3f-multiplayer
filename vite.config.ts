import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
// import { resolve as resolvePath } from "path"

// https://vitejs.dev/config/
export default defineConfig({
  // resolve: {
  //   alias: {
  //     "@components": resolvePath(__dirname, "./src/components"),
  //     "@client-components": resolvePath(__dirname, "./src/client-components"),
  //   },
  // },
  plugins: [react()],
})
