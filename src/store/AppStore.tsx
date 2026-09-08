import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  drivers as seedDrivers,
  fleetLiveStatus as seedFleetLiveStatus,
  fleets as seedFleets,
  loadingAssignments as seedAssignments,
  pettyCashRecaps as seedRecaps,
  salesOrders as seedSalesOrders,
} from '../data/seed'
import type {
  Driver,
  Fleet,
  FleetLiveStatus,
  LoadingAssignment,
  PettyCashRecap,
  SalesOrder,
} from '../types'

interface AppState {
  fleets: Fleet[]
  salesOrders: SalesOrder[]
  assignments: LoadingAssignment[]
  recaps: PettyCashRecap[]
  drivers: Driver[]
  liveStatus: FleetLiveStatus[]
  updateAssignment: (fleetId: string, patch: Partial<LoadingAssignment>) => void
  moveSoToFleet: (soId: string, fleetId: string | null) => void
  departFleet: (fleetId: string, time: string) => void
  cancelDeparture: (fleetId: string) => void
  updateSoLine: (soId: string, lineId: string, patch: { qtyKirim?: number; keranjang?: number; styrofoam?: number }) => void
  removePettyCashItem: (recapId: string, itemId: string) => void
  advanceRecapStatus: (recapId: string, status: PettyCashRecap['status']) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [fleets] = useState<Fleet[]>(seedFleets)
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(seedSalesOrders)
  const [assignments, setAssignments] = useState<LoadingAssignment[]>(seedAssignments)
  const [recaps, setRecaps] = useState<PettyCashRecap[]>(seedRecaps)
  const [drivers] = useState<Driver[]>(seedDrivers)
  const [liveStatus] = useState<FleetLiveStatus[]>(seedFleetLiveStatus)

  const updateAssignment = (fleetId: string, patch: Partial<LoadingAssignment>) => {
    setAssignments((prev) => prev.map((a) => (a.fleetId === fleetId ? { ...a, ...patch } : a)))
  }

  const moveSoToFleet = (soId: string, fleetId: string | null) => {
    setAssignments((prev) =>
      prev.map((a) => {
        const withoutSo = a.soIds.filter((id) => id !== soId)
        if (a.fleetId === fleetId) {
          return { ...a, soIds: [...withoutSo, soId] }
        }
        return { ...a, soIds: withoutSo }
      }),
    )
  }

  const departFleet = (fleetId: string, time: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.fleetId === fleetId ? { ...a, status: 'berangkat', departedAt: time } : a)),
    )
  }

  const cancelDeparture = (fleetId: string) => {
    setAssignments((prev) =>
      prev.map((a) => (a.fleetId === fleetId ? { ...a, status: 'planning', departedAt: null } : a)),
    )
  }

  const updateSoLine: AppState['updateSoLine'] = (soId, lineId, patch) => {
    setSalesOrders((prev) =>
      prev.map((so) =>
        so.id !== soId
          ? so
          : {
              ...so,
              lines: so.lines.map((line) => (line.id === lineId ? { ...line, ...patch } : line)),
            },
      ),
    )
  }

  const removePettyCashItem = (recapId: string, itemId: string) => {
    setRecaps((prev) =>
      prev.map((r) => (r.id === recapId ? { ...r, items: r.items.filter((i) => i.id !== itemId) } : r)),
    )
  }

  const advanceRecapStatus = (recapId: string, status: PettyCashRecap['status']) => {
    setRecaps((prev) => prev.map((r) => (r.id === recapId ? { ...r, status } : r)))
  }

  const value = useMemo(
    () => ({
      fleets,
      salesOrders,
      assignments,
      recaps,
      drivers,
      liveStatus,
      updateAssignment,
      moveSoToFleet,
      departFleet,
      cancelDeparture,
      updateSoLine,
      removePettyCashItem,
      advanceRecapStatus,
    }),
    [fleets, salesOrders, assignments, recaps, drivers, liveStatus],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppStore() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppStore must be used within AppProvider')
  return ctx
}
