import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './components/Index'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/Dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App 