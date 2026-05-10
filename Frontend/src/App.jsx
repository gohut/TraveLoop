import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './Dashboard/Dashboard'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
