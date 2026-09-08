import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { customers as seedCustomers } from '../data/customers'
import { suppliers as seedSuppliers } from '../data/suppliers'
import { vehicles as seedVehicles } from '../data/vehicles'
import { personnel as seedPersonnel } from '../data/personnel'
import { salesOrders as seedSalesOrders } from '../data/salesOrders'
import { dispatchPlans as seedDispatchPlans } from '../data/dispatch'
import { pettyCashRecaps as seedRecaps } from '../data/pettyCash'
import { liveShipmentStatus as seedLiveStatus } from '../data/liveStatus'
import { shipmentDocuments as seedDocuments } from '../data/documents'
import { approvalRequests as seedApprovals } from '../data/approvals'
import { opsTasks as seedTasks } from '../data/tasks'
import { opsAlerts as seedAlerts } from '../data/alerts'
import type {
  ApprovalRequest,
  ApprovalStatus,
  Customer,
  DispatchPlan,
  DocumentStatus,
  LiveShipmentStatus,
  OpsAlert,
  OpsTask,
  Personnel,
  PettyCashRecap,
  SalesOrder,
  ShipmentDocument,
  SoStatus,
  Supplier,
  TaskStatus,
  Vehicle,
} from '../types'

interface AppState {
  customers: Customer[]
  suppliers: Supplier[]
  vehicles: Vehicle[]
  personnel: Personnel[]
  salesOrders: SalesOrder[]
  dispatchPlans: DispatchPlan[]
  recaps: PettyCashRecap[]
  liveStatus: LiveShipmentStatus[]
  documents: ShipmentDocument[]
  approvals: ApprovalRequest[]
  tasks: OpsTask[]
  alerts: OpsAlert[]

  updateDispatch: (vehicleId: string, patch: Partial<DispatchPlan>) => void
  moveSoToVehicle: (soId: string, vehicleId: string | null) => void
  departVehicle: (vehicleId: string, time: string) => void
  cancelDeparture: (vehicleId: string) => void
  updateSoLine: (soId: string, lineId: string, patch: { qtyKirim?: number; keranjang?: number; styrofoam?: number }) => void
  updateSoStatus: (soId: string, status: SoStatus) => void
  removePettyCashItem: (recapId: string, itemId: string) => void
  advanceRecapStatus: (recapId: string, status: PettyCashRecap['status']) => void
  updateDocumentStatus: (docId: string, status: DocumentStatus) => void
  decideApproval: (id: string, status: ApprovalStatus) => void
  updateTaskStatus: (id: string, status: TaskStatus) => void
  resolveAlert: (id: string) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [customers] = useState<Customer[]>(seedCustomers)
  const [suppliers] = useState<Supplier[]>(seedSuppliers)
  const [vehicles] = useState<Vehicle[]>(seedVehicles)
  const [personnel] = useState<Personnel[]>(seedPersonnel)
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(seedSalesOrders)
  const [dispatchPlans, setDispatchPlans] = useState<DispatchPlan[]>(seedDispatchPlans)
  const [recaps, setRecaps] = useState<PettyCashRecap[]>(seedRecaps)
  const [liveStatus] = useState<LiveShipmentStatus[]>(seedLiveStatus)
  const [documents, setDocuments] = useState<ShipmentDocument[]>(seedDocuments)
  const [approvals, setApprovals] = useState(seedApprovals)
  const [tasks, setTasks] = useState<OpsTask[]>(seedTasks)
  const [alerts, setAlerts] = useState<OpsAlert[]>(seedAlerts)

  const updateDispatch: AppState['updateDispatch'] = (vehicleId, patch) => {
    setDispatchPlans((prev) => prev.map((d) => (d.vehicleId === vehicleId ? { ...d, ...patch } : d)))
  }

  const moveSoToVehicle: AppState['moveSoToVehicle'] = (soId, vehicleId) => {
    setDispatchPlans((prev) =>
      prev.map((d) => {
        const withoutSo = d.soIds.filter((id) => id !== soId)
        if (d.vehicleId === vehicleId) return { ...d, soIds: [...withoutSo, soId] }
        return { ...d, soIds: withoutSo }
      }),
    )
    setSalesOrders((prev) => prev.map((so) => (so.id === soId ? { ...so, vehicleId } : so)))
  }

  const departVehicle: AppState['departVehicle'] = (vehicleId, time) => {
    setDispatchPlans((prev) =>
      prev.map((d) => (d.vehicleId === vehicleId ? { ...d, status: 'departed', departedAt: time } : d)),
    )
  }

  const cancelDeparture: AppState['cancelDeparture'] = (vehicleId) => {
    setDispatchPlans((prev) =>
      prev.map((d) => (d.vehicleId === vehicleId ? { ...d, status: 'planning', departedAt: null } : d)),
    )
  }

  const updateSoLine: AppState['updateSoLine'] = (soId, lineId, patch) => {
    setSalesOrders((prev) =>
      prev.map((so) =>
        so.id !== soId
          ? so
          : { ...so, lines: so.lines.map((line) => (line.id === lineId ? { ...line, ...patch } : line)) },
      ),
    )
  }

  const updateSoStatus: AppState['updateSoStatus'] = (soId, status) => {
    setSalesOrders((prev) => prev.map((so) => (so.id === soId ? { ...so, status } : so)))
  }

  const removePettyCashItem: AppState['removePettyCashItem'] = (recapId, itemId) => {
    setRecaps((prev) =>
      prev.map((r) => (r.id === recapId ? { ...r, items: r.items.filter((i) => i.id !== itemId) } : r)),
    )
  }

  const advanceRecapStatus: AppState['advanceRecapStatus'] = (recapId, status) => {
    setRecaps((prev) => prev.map((r) => (r.id === recapId ? { ...r, status } : r)))
  }

  const updateDocumentStatus: AppState['updateDocumentStatus'] = (docId, status) => {
    setDocuments((prev) => prev.map((d) => (d.id === docId ? { ...d, status } : d)))
  }

  const decideApproval: AppState['decideApproval'] = (id, status) => {
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
  }

  const updateTaskStatus: AppState['updateTaskStatus'] = (id, status) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
  }

  const resolveAlert: AppState['resolveAlert'] = (id) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)))
  }

  const value = useMemo(
    () => ({
      customers,
      suppliers,
      vehicles,
      personnel,
      salesOrders,
      dispatchPlans,
      recaps,
      liveStatus,
      documents,
      approvals,
      tasks,
      alerts,
      updateDispatch,
      moveSoToVehicle,
      departVehicle,
      cancelDeparture,
      updateSoLine,
      updateSoStatus,
      removePettyCashItem,
      advanceRecapStatus,
      updateDocumentStatus,
      decideApproval,
      updateTaskStatus,
      resolveAlert,
    }),
    [customers, suppliers, vehicles, personnel, salesOrders, dispatchPlans, recaps, liveStatus, documents, approvals, tasks, alerts],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppStore() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppStore must be used within AppProvider')
  return ctx
}
