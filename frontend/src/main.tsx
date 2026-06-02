import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { MarketFeed } from "./pages/MarketFeed.tsx"
import { Login } from "./pages/login.tsx"
import Settings from "./pages/Settings.tsx"
import { Register } from "./pages/register.tsx"
import Chamber from "./pages/Chamber.tsx"
import Communicate from "./pages/Communicate.tsx"
import { SplashScreen } from "./pages/SplashScreen.tsx"
import { NotFound } from "./pages/NotFound.tsx"
import { AuthLayout } from "./layouts/AuthLayout.tsx"
import { MainLayout } from "./layouts/MainLayout.tsx"
import { RoomInterior } from "./components/RoomInterior.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: "/", element: <SplashScreen /> },
          { path: "/login", element: <Login /> },
          { path: "/register", element: <Register /> },
          { path: "/Chamber/:roomName", element: <RoomInterior /> },
        ],
      },
      {
        element: <MainLayout />,
        children: [
          { path: "/MarketFeed", element: <MarketFeed /> },
          { path: "/Settings", element: <Settings /> },
          { path: "/Chamber", element: <Chamber /> },
          { path: "/Communicate", element: <Communicate /> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="app-theme">
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
