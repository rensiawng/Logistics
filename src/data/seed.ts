import type {
  Driver,
  Fleet,
  FleetLiveStatus,
  LoadingAssignment,
  PettyCashRecap,
  SalesOrder,
} from '../types'

export const TODAY = '2026-09-08'

export const fleets: Fleet[] = [
  {
    id: 'thermo',
    name: 'Thermo',
    type: 'thermo',
    plateNumber: 'B 9021 SHB',
    capacityKg: 1500,
    minTempC: -18,
    maxTempC: -12,
  },
  {
    id: 'coldspace',
    name: 'Coldspace',
    type: 'coldspace',
    plateNumber: 'B 9042 SHB',
    capacityKg: 2000,
    minTempC: -18,
    maxTempC: -14,
  },
  {
    id: 'luxio',
    name: 'Luxio',
    type: 'luxio',
    plateNumber: 'B 9187 SHB',
    capacityKg: 1200,
    minTempC: -20,
    maxTempC: -15,
  },
  {
    id: 'glacia',
    name: 'Glacia',
    type: 'glacia',
    plateNumber: 'B 9204 SHB',
    capacityKg: 1800,
    minTempC: -18,
    maxTempC: -12,
  },
]

export const salesOrders: SalesOrder[] = [
  {
    id: 'so1',
    soNumber: 'SO.2026.09.00007',
    customerName: 'PT Astro Technologies Indonesia',
    lines: [
      { id: 'l1', skuCode: 'FFLAN001072J', skuName: 'ASO GR Milky White 1Kg', qtyKirim: 81, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
      { id: 'l2', skuCode: 'FFLAN001070J', skuName: 'ASO GR Pink Naga 1Kg', qtyKirim: 36, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
      { id: 'l3', skuCode: 'FFLAN001071J', skuName: 'ASO GR Tropical Sunrise 1Kg', qtyKirim: 43, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
      { id: 'l4', skuCode: 'FFLAN001073J', skuName: 'ASO GR Avocado Banana 1Kg', qtyKirim: 20, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
    ],
  },
  {
    id: 'so2',
    soNumber: 'SO.2026.09.00246',
    customerName: 'ANTONY - JUS AJA KARAWANG',
    lines: [
      { id: 'l5', skuCode: 'FFALP00001J', skuName: 'Alpukat Kupas 1Kg', qtyKirim: 60, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
      { id: 'l6', skuCode: 'FFMAG00176J', skuName: 'Mangga Dadu 500 Gram', qtyKirim: 40, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
      { id: 'l7', skuCode: 'FFNAS00264J', skuName: 'Nanas Dadu 1Kg', qtyKirim: 50, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
      { id: 'l8', skuCode: 'FFMAG00176J', skuName: 'Mangga Dadu 500 Gram', qtyKirim: 40, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
      { id: 'l9', skuCode: 'FFNAS00264J', skuName: 'Nanas Dadu 1Kg', qtyKirim: 40, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
    ],
  },
  {
    id: 'so3',
    soNumber: 'SO.2026.09.00260',
    customerName: 'PT.AGREYA BERKAH INDONESIA - BOGOR',
    lines: [
      { id: 'l10', skuCode: 'FFNAG00244J', skuName: 'Naga 150 Gram', qtyKirim: 60, keranjang: null, styrofoam: null, statusKirim: 'diterima' },
      { id: 'l11', skuCode: 'FFMAG00165J', skuName: 'Mangga 150 Gram', qtyKirim: 50, keranjang: null, styrofoam: null, statusKirim: 'diterima' },
    ],
  },
  {
    id: 'so4',
    soNumber: 'SO.2026.09.00275',
    customerName: 'PT ADHYA BAKED CORP',
    lines: [
      { id: 'l12', skuCode: 'FFSTW00336J', skuName: 'Strawberry Grade A 1Kg', qtyKirim: 30, keranjang: null, styrofoam: null, statusKirim: 'diterima' },
    ],
  },
  {
    id: 'so5',
    soNumber: 'SO.2026.09.00274',
    customerName: 'JUS GEDONG KUNINGAN',
    lines: [
      { id: 'l13', skuCode: 'FFMXB00232J', skuName: 'Mixberry Mix 3 (straw/rasp/black) 1Kg', qtyKirim: 24, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
      { id: 'l14', skuCode: 'FFSTW00336J', skuName: 'Strawberry Grade A 1Kg', qtyKirim: 20, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
      { id: 'l15', skuCode: 'FFSIR00356J', skuName: 'Sirsak 1Kg', qtyKirim: 18, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
    ],
  },
  {
    id: 'so6',
    soNumber: 'SO.2026.09.00254',
    customerName: 'PT. QUANTUM PIRING EMAS',
    lines: [
      { id: 'l16', skuCode: 'FFLAN00142', skuName: 'Singkong Agrotech 1Kg', qtyKirim: 25, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
    ],
  },
  {
    id: 'so7',
    soNumber: 'SO.2026.09.00279',
    customerName: 'COCO FOOD INDONESIA',
    lines: [
      { id: 'l17', skuCode: 'FFSTW00328J', skuName: 'Strawberry Grade Campur 1Kg', qtyKirim: 22, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
      { id: 'l18', skuCode: 'FFMAG00168J', skuName: 'Mangga 500 Gram', qtyKirim: 35, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
      { id: 'l19', skuCode: 'FFDUR00056J', skuName: 'Durian Medan 1Kg', qtyKirim: 15, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
      { id: 'l20', skuCode: 'FFMAR00192J', skuName: 'Markisa 1Kg', qtyKirim: 18, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
    ],
  },
  {
    id: 'so8',
    soNumber: 'SO.2026.09.00290',
    customerName: 'COCO FOOD INDONESIA',
    lines: [
      { id: 'l21', skuCode: 'FFALP00007J', skuName: 'Alpukat 500 Gram', qtyKirim: 40, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
      { id: 'l22', skuCode: 'FFSIR00356J', skuName: 'Sirsak 1Kg', qtyKirim: 20, keranjang: null, styrofoam: null, statusKirim: 'belum_kirim' },
    ],
  },
]

export const loadingAssignments: LoadingAssignment[] = [
  {
    fleetId: 'thermo',
    date: TODAY,
    soIds: ['so1', 'so2'],
    driver: '',
    helper: '',
    status: 'planning',
    departedAt: null,
    eta: null,
  },
  {
    fleetId: 'coldspace',
    date: TODAY,
    soIds: ['so3', 'so4', 'so5'],
    driver: 'IWAN',
    helper: 'Arya',
    status: 'berangkat',
    departedAt: '09:00',
    eta: '13:30',
  },
  {
    fleetId: 'luxio',
    date: TODAY,
    soIds: ['so6', 'so7', 'so8'],
    driver: '',
    helper: '',
    status: 'planning',
    departedAt: null,
    eta: null,
  },
  {
    fleetId: 'glacia',
    date: TODAY,
    soIds: [],
    driver: '',
    helper: '',
    status: 'planning',
    departedAt: null,
    eta: null,
  },
]

export const pettyCashRecaps: PettyCashRecap[] = [
  {
    id: 'pc1',
    fleetId: 'coldspace',
    rit: 1,
    tanggal: '2026-09-07',
    picName: 'Pak Ipul',
    budget: 500000,
    status: 'perlu_verifikasi',
    items: [
      { id: 'i1', label: 'Duta indah - parkir', category: 'parkir', amount: 6000, photoNote: 'struk parkir' },
      { id: 'i2', label: 'Kuncoran - tol', category: 'tol', amount: 9000, photoNote: 'struk tol' },
      { id: 'i3', label: 'Tangerang - tol', category: 'tol', amount: 8500, photoNote: 'struk tol' },
      { id: 'i4', label: 'Kuncoran - tol', category: 'tol', amount: 8500, photoNote: 'struk tol' },
      { id: 'i5', label: 'Tomang - tol', category: 'tol', amount: 11000, photoNote: 'struk tol' },
      { id: 'i6', label: 'Semper 1 - tol', category: 'tol', amount: 17000, photoNote: 'struk tol' },
      { id: 'i7', label: 'Solvent isi BBM', category: 'bbm', amount: 559500, photoNote: 'struk BBM' },
    ],
  },
  {
    id: 'pc2',
    fleetId: 'thermo',
    rit: 1,
    tanggal: '2026-09-06',
    picName: 'Deni',
    budget: 400000,
    status: 'nunggu_approval',
    items: [
      { id: 'i8', label: 'BBM Pertamina Cawang', category: 'bbm', amount: 350000, photoNote: 'struk BBM' },
      { id: 'i9', label: 'Cikampek - tol', category: 'tol', amount: 32000, photoNote: 'struk tol' },
      { id: 'i10', label: 'Makan siang tim', category: 'lainnya', amount: 45000, photoNote: 'struk makan' },
    ],
  },
  {
    id: 'pc3',
    fleetId: 'luxio',
    rit: 2,
    tanggal: '2026-09-06',
    picName: 'Bayu',
    budget: 400000,
    status: 'nunggu_approval',
    items: [
      { id: 'i11', label: 'Parkir Kuningan', category: 'parkir', amount: 15000, photoNote: 'struk parkir' },
      { id: 'i12', label: 'Bekasi Timur - tol', category: 'tol', amount: 14500, photoNote: 'struk tol' },
      { id: 'i13', label: 'BBM Shell MT Haryono', category: 'bbm', amount: 380726, photoNote: 'struk BBM' },
    ],
  },
  {
    id: 'pc4',
    fleetId: 'glacia',
    rit: 1,
    tanggal: '2026-09-05',
    picName: 'Sujono',
    budget: 400000,
    status: 'nunggu_approval',
    items: [
      { id: 'i14', label: 'BBM Pertamina Kalimalang', category: 'bbm', amount: 340000, photoNote: 'struk BBM' },
      { id: 'i15', label: 'Cibitung - tol', category: 'tol', amount: 21500, photoNote: 'struk tol' },
    ],
  },
]

export const drivers: Driver[] = [
  { id: 'd1', name: 'IWAN', phone: '0812-8801-4521', licenseExpiry: '2027-03-11', totalTrips: 214, onTimeRate: 96, incidentCount: 0, avgTempExcursionMin: 2 },
  { id: 'd2', name: 'Deni', phone: '0813-1092-7734', licenseExpiry: '2026-11-02', totalTrips: 178, onTimeRate: 91, incidentCount: 1, avgTempExcursionMin: 6 },
  { id: 'd3', name: 'Bayu', phone: '0857-7712-9034', licenseExpiry: '2026-10-19', totalTrips: 152, onTimeRate: 88, incidentCount: 2, avgTempExcursionMin: 11 },
  { id: 'd4', name: 'Sujono', phone: '0821-4456-2201', licenseExpiry: '2026-09-30', totalTrips: 96, onTimeRate: 94, incidentCount: 0, avgTempExcursionMin: 3 },
  { id: 'd5', name: 'Arya', phone: '0896-3321-7789', licenseExpiry: '2027-01-08', totalTrips: 63, onTimeRate: 97, incidentCount: 0, avgTempExcursionMin: 1 },
]

export const fleetLiveStatus: FleetLiveStatus[] = [
  {
    fleetId: 'coldspace',
    lastLocation: 'Tol Cikampek KM 19, arah Karawang',
    lastUpdateMinutesAgo: 4,
    currentTempC: -15.4,
    progressPct: 62,
    nextStop: 'PT ADHYA BAKED CORP',
    tempLog: [
      { time: '09:00', tempC: -17.8 },
      { time: '09:30', tempC: -17.1 },
      { time: '10:00', tempC: -16.6 },
      { time: '10:30', tempC: -10.2 },
      { time: '11:00', tempC: -15.9 },
      { time: '11:30', tempC: -15.4 },
    ],
    alert: 'Suhu sempat naik ke -10.2°C jam 10:30 (pintu terbuka >5 menit)',
  },
  {
    fleetId: 'thermo',
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
    fleetId: 'luxio',
    lastLocation: 'Gudang SHB - belum berangkat',
    lastUpdateMinutesAgo: 0,
    currentTempC: -17.9,
    progressPct: 0,
    nextStop: 'PT. QUANTUM PIRING EMAS',
    tempLog: [
      { time: '08:00', tempC: -18.0 },
      { time: '08:30', tempC: -17.9 },
    ],
    alert: null,
  },
  {
    fleetId: 'glacia',
    lastLocation: 'Workshop - servis rutin',
    lastUpdateMinutesAgo: 120,
    currentTempC: -18.0,
    progressPct: 0,
    nextStop: '-',
    tempLog: [],
    alert: 'Unit standby, belum ada rute hari ini',
  },
]

export const weeklyDeliveryTrend = [
  { day: 'Sen', onTime: 18, late: 2 },
  { day: 'Sel', onTime: 21, late: 1 },
  { day: 'Rab', onTime: 19, late: 3 },
  { day: 'Kam', onTime: 22, late: 1 },
  { day: 'Jum', onTime: 20, late: 2 },
  { day: 'Sab', onTime: 14, late: 0 },
]

export const pettyCashTrend = [
  { week: 'W1', spend: 3_120_000, budget: 4_000_000 },
  { week: 'W2', spend: 3_680_000, budget: 4_000_000 },
  { week: 'W3', spend: 4_808_726, budget: 4_000_000 },
  { week: 'W4', spend: 3_340_000, budget: 4_000_000 },
]

export const skuVolume = [
  { name: 'Mangga', qty: 420 },
  { name: 'Strawberry', qty: 310 },
  { name: 'Alpukat', qty: 260 },
  { name: 'Nanas', qty: 190 },
  { name: 'Naga', qty: 150 },
  { name: 'Durian', qty: 95 },
]
