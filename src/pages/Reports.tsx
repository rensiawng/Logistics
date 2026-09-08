import type { ReactNode } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Layout } from '../components/Layout'
import { pettyCashTrend, skuVolume, weeklyDeliveryTrend } from '../data/seed'
import { formatRupiah } from '../lib/format'

const COLORS = { onTime: '#5a70ab', late: '#f59e0b', budget: '#94a3b8', spend: '#2a3e8f', volume: '#2f7d3a' }

export default function Reports() {
  const totalOnTime = weeklyDeliveryTrend.reduce((s, d) => s + d.onTime, 0)
  const totalLate = weeklyDeliveryTrend.reduce((s, d) => s + d.late, 0)
  const onTimeRate = Math.round((totalOnTime / (totalOnTime + totalLate)) * 100)

  return (
    <Layout title="Reports" subtitle="Ringkasan performa pengiriman, petty cash, dan volume SKU">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Ketepatan Waktu Pengiriman" hint={`On-time rate 7 hari: ${onTimeRate}%`}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={weeklyDeliveryTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="onTime" name="Tepat Waktu" stackId="a" fill={COLORS.onTime} radius={[0, 0, 0, 0]} />
              <Bar dataKey="late" name="Terlambat" stackId="a" fill={COLORS.late} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tren Pengeluaran Petty Cash" hint="Bandingkan realisasi vs budget mingguan">
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={pettyCashTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" tickFormatter={(v) => `${v / 1_000_000}jt`} />
              <Tooltip formatter={(v) => formatRupiah(Number(v))} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="spend" name="Realisasi" fill={COLORS.spend} radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="budget" name="Budget" stroke={COLORS.budget} strokeWidth={2} strokeDasharray="5 4" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Volume Pengiriman per Kategori SKU" hint="Total qty terkirim minggu ini">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={skuVolume} layout="vertical" margin={{ left: 12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" width={80} />
              <Tooltip />
              <Bar dataKey="qty" name="Qty" fill={COLORS.volume} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Insight Otomatis" hint="Ringkasan mingguan">
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-2">
              <span className="font-bold text-navy-900">•</span>
              On-time rate {onTimeRate}% — turun di hari Rabu karena 3 SO terlambat, cek beban rute Coldspace.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-navy-900">•</span>
              Pengeluaran petty cash minggu ke-3 melebihi budget ({formatRupiah(4_808_726)} dari {formatRupiah(4_000_000)}), didorong biaya BBM tak terduga.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-navy-900">•</span>
              Mangga & Strawberry adalah 2 kategori dengan volume tertinggi — pertimbangkan rute khusus untuk kedua SKU ini.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-navy-900">•</span>
              Armada Coldspace mengalami 1 kali excursion suhu minggu ini — jadwalkan pengecekan seal pintu reefer.
            </li>
          </ul>
        </ChartCard>
      </div>
    </Layout>
  )
}

function ChartCard({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <p className="font-bold text-navy-900">{title}</p>
      <p className="mb-2 text-xs text-slate-400">{hint}</p>
      {children}
    </div>
  )
}
