import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from './store/AppStore'
import Dashboard from './pages/Dashboard'
import SalesOrders from './pages/SalesOrders'
import DispatchPlanning from './pages/DispatchPlanning'
import LoadingPlan from './pages/LoadingPlan'
import ShipmentTracking from './pages/ShipmentTracking'
import FleetVehicles from './pages/FleetVehicles'
import Personnel from './pages/Personnel'
import PettyCash from './pages/PettyCash'
import Documents from './pages/Documents'
import Approvals from './pages/Approvals'
import Tasks from './pages/Tasks'
import Partners from './pages/Partners'
import Alerts from './pages/Alerts'
import Reports from './pages/Reports'

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales-orders" element={<SalesOrders />} />
          <Route path="/dispatch-planning" element={<DispatchPlanning />} />
          <Route path="/loading-plan" element={<LoadingPlan />} />
          <Route path="/shipment-tracking" element={<ShipmentTracking />} />
          <Route path="/fleet" element={<FleetVehicles />} />
          <Route path="/personnel" element={<Personnel />} />
          <Route path="/petty-cash" element={<PettyCash />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  )
}
