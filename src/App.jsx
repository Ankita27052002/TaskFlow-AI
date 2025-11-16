import { Routes, Route } from 'react-router-dom'
import { Toaster } from './components/ui/toaster'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import KanbanBoard from './pages/KanbanBoard'
import Analytics from './pages/Analytics'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="kanban" element={<KanbanBoard />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
