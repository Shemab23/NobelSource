import { Outlet } from "react-router-dom"
import { GlobalProvider } from "./utilits/Hooks/General"

function App() {
  return (
    <GlobalProvider>
      <Outlet />
    </GlobalProvider>
  )
}

export default App
