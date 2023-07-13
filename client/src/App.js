import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./components/Login"
import Home from "./components/Home"
import Registration from "./components/Registration"
import axios from "axios"

export default function App() {
  const loc = window.location
  axios.defaults.baseURL = `${loc.protocol}//${loc.hostname}${loc.hostname === "localhost" ? ":3001" : ":"}`
  axios.defaults.proxy = {
    protocol: 'https',
    hostname: 'localhost',
    port: 3001
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </BrowserRouter>
  )
}