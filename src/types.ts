export type VehicleCategory = 'reefer' | 'chiller' | 'dry_van' | 'pickup'

export interface Vehicle {
  id: string
  name: string
  plateNumber: string
  category: VehicleCategory
  capacityKg: number
  minTempC: number
  maxTempC: number
  stnkExpiry: string
  kirExpiry: string
  insuranceExpiry: string
  odometerKm: number
  nextServiceKm: number
  assignedDriverId: string | null
}

export type PersonnelRole = 'driver' | 'helper'

export interface Personnel {
  id: string
  name: string
  role: PersonnelRole
  phone: string
  licenseExpiry: string | null
  totalTrips: number
  onTimeRate: number
  incidentCount: number
  avgTempExcursionMin: number
  active: boolean
}

export interface SoLine {
  id: string
  skuCode: string
  skuName: string
  qtyKirim: number
  keranjang: number | null
  styrofoam: number | null
  lineStatus: 'pending' | 'received' | 'partial_return'
}

export type SoStatus =
  | 'draft'
  | 'confirmed'
  | 'planned'
  | 'loading'
  | 'in_transit'
  | 'delivered'
  | 'pod_received'
  | 'on_hold'

export const SO_STATUS_ORDER: SoStatus[] = [
  'draft',
  'confirmed',
  'planned',
  'loading',
  'in_transit',
  'delivered',
  'pod_received',
]

export interface SalesOrder {
  id: string
  soNumber: string
  customerId: string
  orderDate: string
  deliveryDate: string
  status: SoStatus
  vehicleId: string | null
  lines: SoLine[]
  notes: string | null
}

export interface DispatchPlan {
  vehicleId: string
  date: string
  routeName: string
  stops: string[]
  soIds: string[]
  driver: string
  helper: string
  status: 'planning' | 'ready' | 'departed'
  departedAt: string | null
  eta: string | null
}

export interface PettyCashItem {
  id: string
  label: string
  category: 'tol' | 'parkir' | 'bbm' | 'lainnya'
  amount: number
}

export type PettyCashStatus = 'perlu_verifikasi' | 'siap_refill' | 'nunggu_approval' | 'selesai'

export interface PettyCashRecap {
  id: string
  vehicleId: string
  rit: number
  tanggal: string
  picName: string
  budget: number
  status: PettyCashStatus
  items: PettyCashItem[]
}

export interface TempLogPoint {
  time: string
  tempC: number
}

export interface LiveShipmentStatus {
  vehicleId: string
  lastLocation: string
  lastUpdateMinutesAgo: number
  currentTempC: number
  progressPct: number
  nextStop: string
  tempLog: TempLogPoint[]
  alert: string | null
}

export type DocumentType =
  | 'delivery_order'
  | 'invoice'
  | 'packing_list'
  | 'pod'
  | 'customs_declaration'
  | 'phyto_certificate'
  | 'cold_chain_log'

export type DocumentStatus = 'missing' | 'draft' | 'issued' | 'received'

export interface ShipmentDocument {
  id: string
  soId: string
  type: DocumentType
  status: DocumentStatus
  dueDate: string
  note: string | null
}

export type ApprovalType = 'petty_cash' | 'discount' | 'credit_term' | 'route_change' | 'document_exception'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export interface ApprovalRequest {
  id: string
  type: ApprovalType
  title: string
  description: string
  refLabel: string
  requestedBy: string
  amount: number | null
  status: ApprovalStatus
  createdAt: string
}

export type TaskCategory = 'dispatch' | 'documentation' | 'finance' | 'fleet' | 'customer' | 'general'
export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'todo' | 'in_progress' | 'done'

export interface OpsTask {
  id: string
  title: string
  category: TaskCategory
  assignee: string
  dueDate: string
  priority: TaskPriority
  status: TaskStatus
  linkedSoNumber: string | null
}

export type AlertSeverity = 'info' | 'warning' | 'critical'
export type AlertCategory = 'cold_chain' | 'petty_cash' | 'compliance' | 'fleet' | 'sla'

export interface OpsAlert {
  id: string
  severity: AlertSeverity
  category: AlertCategory
  message: string
  relatedLabel: string
  relatedPath: string
  createdAt: string
  resolved: boolean
}

export type CustomerSegment = 'retail' | 'horeca' | 'distributor' | 'export'

export interface Customer {
  id: string
  name: string
  city: string
  address: string
  contactName: string
  contactPhone: string
  segment: CustomerSegment
  coldChainRequired: boolean
  tempRangeC: string
  dockHours: string
  creditTermDays: number
}

export interface Supplier {
  id: string
  name: string
  originCity: string
  originCountry: string
  commodity: string
  incoterm: string
  contactName: string
  contactPhone: string
  leadTimeDays: number
  certification: string
}
