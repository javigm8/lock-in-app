import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Whiteboard from './pages/Whiteboard'
import TasksPage from './pages/TasksPage'
import NotesPage from './pages/NotesPage'
import TempPage from './pages/TempPage'
import StatisticsPage from './pages/StatisticsPage'
import AppLayout from './AppLayout'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pizarra" element={<Whiteboard />} />

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tareas" element={<TasksPage />} />
        <Route path="/notas" element={<NotesPage />} />
        <Route path="/temporizador" element={<TempPage />} />
        <Route path="/estadisticas" element={<StatisticsPage />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App