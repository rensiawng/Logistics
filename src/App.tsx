import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from './store/AppStore'
import Dashboard from './pages/Dashboard'
import RoutePlanner from './pages/RoutePlanner'
import LoadingPlan from './pages/LoadingPlan'
import FleetTracking from './pages/FleetTracking'
import PettyCash from './pages/PettyCash'
import Drivers from './pages/Drivers'
import Reports from './pages/Reports'

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/route-planner" element={<RoutePlanner />} />
          <Route path="/loading-plan" element={<LoadingPlan />} />
          <Route path="/fleet-tracking" element={<FleetTracking />} />
          <Route path="/petty-cash" element={<PettyCash />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  )
}
