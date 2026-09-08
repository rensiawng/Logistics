import type { ReactNode } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Layout } from '../components/Layout'
import { Card } from '../components/ui'
import { documentComplianceTrend, pettyCashTrend, skuVolume, weeklyDeliveryTrend } from '../data/analytics'
import { formatRupiah } from '../lib/format'

const COLORS = { onTime: '#147361', late: '#b9711a', budget: '#a39c90', spend: '#2d5686', volume: '#4a7a3a', compliance: '#1c8e77' }

export default function Reports() {
  const totalOnTime = weeklyDeliveryTrend.reduce((s, d) => s + d.onTime, 0)
  const totalLate = weeklyDeliveryTrend.reduce((s, d) => s + d.late, 0)
  const onTimeRate = Math.round((totalOnTime / (totalOnTime + totalLate)) * 100)

  return (
    <Layout title="Reports" subtitle="Ringkasan performa pengiriman, petty cash, kepatuhan dokumen, dan volume SKU">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Ketepatan Waktu Pengiriman" hint={`On-time rate 7 hari: ${onTimeRate}%`}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyDeliveryTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#efebe0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#a39c90" />
              <YAxis tick={{ fontSize: 12 }} stroke="#a39c90" />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="onTime" name="Tepat Waktu" stackId="a" fill={COLORS.onTime} />
              <Bar dataKey="late" name="Terlambat" stackId="a" fill={COLORS.late} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tren Pengeluaran Petty Cash" hint="Bandingkan realisasi vs budget mingguan">
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={pettyCashTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#efebe0" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#a39c90" />
              <YAxis tick={{ fontSize: 11 }} stroke="#a39c90" tickFormatter={(v) => `${v / 1_000_000}jt`} />
              <Tooltip formatter={(v) => formatRupiah(Number(v))} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="spend" name="Realisasi" fill={COLORS.spend} radius={[3, 3, 0, 0]} />
              <Line type="monotone" dataKey="budget" name="Budget" stroke={COLORS.budget} strokeWidth={2} strokeDasharray="5 4" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Kepatuhan Dokumen Tepat Waktu" hint="Persentase dokumen terbit sebelum armada berangkat">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={documentComplianceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#efebe0" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#a39c90" />
              <YAxis tick={{ fontSize: 12 }} stroke="#a39c90" domain={[0, 100]} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="onTime" name="On-Time" fill={COLORS.compliance} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Volume Pengiriman per Kategori SKU" hint="Total qty terkirim minggu ini">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={skuVolume} layout="vertical" margin={{ left: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#efebe0" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#a39c90" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#a39c90" width={80} />
              <Tooltip />
              <Bar dataKey="qty" name="Qty" fill={COLORS.volume} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Insight Otomatis" hint="Ringkasan mingguan" className="mt-4">
        <ul className="space-y-3 text-sm text-ink-600">
          <li className="flex gap-2">
            <span className="font-bold text-ink-900">•</span>
            On-time rate {onTimeRate}% — turun di hari Rabu karena 3 SO terlambat, cek beban rute reefer.
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-ink-900">•</span>
            Pengeluaran petty cash minggu ke-3 melebihi budget ({formatRupiah(4_808_726)} dari {formatRupiah(4_000_000)}), didorong biaya BBM tak terduga.
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-ink-900">•</span>
            Kepatuhan dokumen turun ke 81% di minggu ke-3, sejalan dengan lonjakan pengiriman yang melibatkan customs declaration.
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-ink-900">•</span>
            Mango & Strawberry adalah 2 kategori dengan volume tertinggi — pertimbangkan rute khusus untuk kedua SKU ini.
          </li>
        </ul>
      </ChartCard>
    </Layout>
  )
}

function ChartCard({ title, hint, children, className = '' }: { title: string; hint: string; children: ReactNode; className?: string }) {
  return (
    <Card className={className}>
      <p className="font-bold text-ink-900">{title}</p>
      <p className="mb-2 text-xs text-ink-400">{hint}</p>
      {children}
    </Card>
  )
}
