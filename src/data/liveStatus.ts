import type { LiveShipmentStatus } from '../types'

export const liveShipmentStatus: LiveShipmentStatus[] = [
  {
    vehicleId: 'veh-dry01',
    lastLocation: 'Tol Kebon Jeruk KM 6, arah Tangerang',
    lastUpdateMinutesAgo: 4,
    currentTempC: -13.2,
    progressPct: 55,
    nextStop: 'Coco Food Indonesia',
    tempLog: [
      { time: '09:00', tempC: -17.8 },
      { time: '09:30', tempC: -17.1 },
      { time: '10:00', tempC: -16.6 },
      { time: '10:30', tempC: -9.8 },
      { time: '11:00', tempC: -14.1 },
      { time: '11:30', tempC: -13.2 },
    ],
    alert: 'Suhu sempat naik ke -9.8°C jam 10:30 (pintu terbuka >5 menit)',
  },
  {
    vehicleId: 'veh-ref01',
    lastLocation: 'Gudang SHB - belum berangkat',
    lastUpdateMinutesAgo: 0,
    currentTempC: -18.2,
    progressPct: 0,
    nextStop: 'PT Astro Technologies Indonesia',
    tempLog: [
      { time: '08:00', tempC: -18.4 },
      { time: '08:30', tempC: -18.2 },
    ],
    alert: null,
  },
  {
    vehicleId: 'veh-ref02',
    lastLocation: 'Gudang SHB - standby',
    lastUpdateMinutesAgo: 0,
    currentTempC: -17.9,
    progressPct: 0,
    nextStop: '-',
    tempLog: [
      { time: '08:00', tempC: -18.0 },
      { time: '08:30', tempC: -17.9 },
    ],
    alert: null,
  },
  {
    vehicleId: 'veh-chl01',
    lastLocation: 'Workshop - servis rutin',
    lastUpdateMinutesAgo: 120,
    currentTempC: -18.0,
    progressPct: 0,
    nextStop: '-',
    tempLog: [],
    alert: 'Unit standby untuk servis, belum ada rute hari ini',
  },
]
