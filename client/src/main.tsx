import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import App from "./App"
import { store } from "./app/store"
import "./index.scss"
import { disableReactDevTools } from "@fvilers/disable-react-devtools"
import { SocketContextProvider } from "./context/socketContext"

if (import.meta.env.VITE_NODE_ENV === "production") {
  disableReactDevTools()
}

const container = document.getElementById("root")

if (container) {
  const root = createRoot(container)

  root.render(
    <Provider store={store}>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </Provider>,
  )
} else {
  throw new Error(
    "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
  )
}
