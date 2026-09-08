import type { SoStatus } from '../types'

export const soStatusMeta: Record<SoStatus, { label: string; tone: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'brand' }> = {
  draft: { label: 'Draft', tone: 'neutral' },
  confirmed: { label: 'Confirmed', tone: 'info' },
  planned: { label: 'Planned', tone: 'brand' },
  loading: { label: 'Loading', tone: 'brand' },
  in_transit: { label: 'In Transit', tone: 'warning' },
  delivered: { label: 'Delivered', tone: 'success' },
  pod_received: { label: 'POD Received', tone: 'success' },
  on_hold: { label: 'On Hold', tone: 'danger' },
}

export const allSoStatuses: SoStatus[] = [
  'draft',
  'confirmed',
  'planned',
  'loading',
  'in_transit',
  'delivered',
  'pod_received',
  'on_hold',
]
