import { useState } from 'react'
import { Snowflake, Thermometer } from 'lucide-react'
import { Layout } from '../components/Layout'
import { Card } from '../components/ui'
import { StatusPill } from '../components/StatusPill'
import { useAppStore } from '../store/AppStore'

const segmentLabel: Record<string, string> = {
  retail: 'Retail',
  horeca: 'HoReCa',
  distributor: 'Distributor',
  export: 'Export',
}

export default function Partners() {
  const { customers, suppliers } = useAppStore()
  const [tab, setTab] = useState<'customers' | 'suppliers'>('customers')

  return (
    <Layout title="Customers & Suppliers" subtitle="Informasi logistik mitra: alamat, jam dermaga, kebutuhan rantai dingin, dan incoterm">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTab('customers')}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
            tab === 'customers' ? 'bg-ink-900 text-white' : 'border border-ink-200 bg-white text-ink-600 hover:bg-ink-50'
          }`}
        >
          Customers ({customers.length})
        </button>
        <button
          onClick={() => setTab('suppliers')}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
            tab === 'suppliers' ? 'bg-ink-900 text-white' : 'border border-ink-200 bg-white text-ink-600 hover:bg-ink-50'
          }`}
        >
          Suppliers ({suppliers.length})
        </button>
      </div>

      {tab === 'customers' ? (
        <div className="space-y-3">
          {customers.map((c) => (
            <Card key={c.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-ink-900">{c.name}</p>
                  <p className="text-xs text-ink-500">{c.address}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <StatusPill tone="neutral">{segmentLabel[c.segment]}</StatusPill>
                  {c.coldChainRequired && (
                    <StatusPill tone="info">
                      <Snowflake size={11} className="mr-0.5" /> Cold Chain
                    </StatusPill>
                  )}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Info label="Kontak" value={`${c.contactName} · ${c.contactPhone}`} />
                <Info label="Jam Dermaga" value={c.dockHours} />
                <Info label="Suhu Terima" value={c.tempRangeC} />
                <Info label="Termin Kredit" value={`${c.creditTermDays} hari`} />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {suppliers.map((s) => (
            <Card key={s.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-ink-900">{s.name}</p>
                  <p className="text-xs text-ink-500">
                    {s.originCity}, {s.originCountry}
                  </p>
                </div>
                <StatusPill tone="neutral">
                  <Thermometer size={11} className="mr-0.5" /> {s.incoterm}
                </StatusPill>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Info label="Komoditas" value={s.commodity} />
                <Info label="Kontak" value={`${s.contactName} · ${s.contactPhone}`} />
                <Info label="Lead Time" value={`${s.leadTimeDays} hari`} />
                <Info label="Sertifikasi" value={s.certification} />
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-ink-50 p-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{label}</p>
      <p className="text-sm font-semibold text-ink-800">{value}</p>
    </div>
  )
}
