import { Routes, Route } from "react-router-dom"
import './App.css'
import Navbar from "../components/navbar.jsx"
import About from "./pages/About"

import CapturePage from "./pages/Capture.jsx"

function App() {
  return (
    
    <>
    <Navbar/>
    <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/capture" element={<CapturePage />} />
       
        <Route path="/" element={<About />} /> {/* default page */}
      </Routes>
    </>
  )
}

export default App
