export type FleetType = 'thermo' | 'coldspace' | 'luxio' | 'glacia'

export interface SoLine {
  id: string
  skuCode: string
  skuName: string
  qtyKirim: number
  keranjang: number | null
  styrofoam: number | null
  statusKirim: 'belum_kirim' | 'diterima' | 'retur_sebagian'
}

export interface SalesOrder {
  id: string
  soNumber: string
  customerName: string
  lines: SoLine[]
}

export interface Fleet {
  id: string
  name: string
  type: FleetType
  plateNumber: string
  capacityKg: number
  minTempC: number
  maxTempC: number
}

export interface LoadingAssignment {
  fleetId: string
  date: string
  soIds: string[]
  driver: string
  helper: string
  status: 'planning' | 'siap_loading' | 'berangkat'
  departedAt: string | null
  eta: string | null
}

export interface PettyCashItem {
  id: string
  label: string
  category: 'tol' | 'parkir' | 'bbm' | 'lainnya'
  amount: number
  photoNote: string
}

export type PettyCashStatus = 'perlu_verifikasi' | 'siap_refill' | 'nunggu_approval' | 'selesai'

export interface PettyCashRecap {
  id: string
  fleetId: string
  rit: number
  tanggal: string
  picName: string
  budget: number
  status: PettyCashStatus
  items: PettyCashItem[]
}

export interface Driver {
  id: string
  name: string
  phone: string
  licenseExpiry: string
  totalTrips: number
  onTimeRate: number
  incidentCount: number
  avgTempExcursionMin: number
}

export interface TempLogPoint {
  time: string
  tempC: number
}

export interface FleetLiveStatus {
  fleetId: string
  lastLocation: string
  lastUpdateMinutesAgo: number
  currentTempC: number
  progressPct: number
  nextStop: string
  tempLog: TempLogPoint[]
  alert: string | null
}
