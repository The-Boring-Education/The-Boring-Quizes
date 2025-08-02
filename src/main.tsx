import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import { QueryProvider } from "./providers/QueryProvider"
import { AuthProvider } from "./contexts/AuthContext"
import "./index.css"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </QueryProvider>
    </StrictMode>
)
