import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './components/Index'
import Dashboard from './components/Dashboard'
import Login from  './components/Login'
import GroupsWorldCup from './components/GroupsWorldCup'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/GroupsWorldCup" element={<GroupsWorldCup/>} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App 