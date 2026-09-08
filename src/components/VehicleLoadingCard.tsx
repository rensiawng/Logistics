import { Fragment, useState } from 'react'
import type { DispatchPlan, SalesOrder, Vehicle } from '../types'
import { themeForIndex } from '../lib/fleetTheme'
import { useAppStore } from '../store/AppStore'
import { StatusPill } from './StatusPill'
import { Card } from './ui'

const lineStatusMeta = {
  pending: { label: 'Belum Kirim', tone: 'neutral' as const },
  received: { label: 'Diterima', tone: 'success' as const },
  partial_return: { label: 'Retur Sebagian', tone: 'warning' as const },
}

export function VehicleLoadingCard({
  vehicle,
  index,
  plan,
  soList,
  customerNameOf,
}: {
  vehicle: Vehicle
  index: number
  plan: DispatchPlan
  soList: SalesOrder[]
  customerNameOf: (customerId: string) => string
}) {
  const { updateDispatch, departVehicle, cancelDeparture, updateSoLine } = useAppStore()
  const theme = themeForIndex(index)
  const [editingTime, setEditingTime] = useState(false)
  const [timeDraft, setTimeDraft] = useState(plan.departedAt ?? '')
  const [managementUnlock, setManagementUnlock] = useState(false)

  const allLines = soList.flatMap((so) => so.lines)
  const styrofoamTotal = allLines.reduce((s, l) => s + (l.styrofoam ?? 0), 0)
  const canDepart = plan.driver.trim().length > 0 && plan.helper.trim().length > 0
  const isDeparted = plan.status === 'departed'
  const fieldsLocked = isDeparted && !managementUnlock

  return (
    <Card className={`overflow-hidden border-l-4 p-0 ${theme.border}`}>
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-md text-sm font-bold text-white ${theme.chip}`}>
              {vehicle.name.slice(0, 2)}
            </div>
            <div>
              <p className="text-lg font-bold text-ink-900">{vehicle.name}</p>
              <p className="text-xs text-ink-500">{soList.length} SO · {vehicle.plateNumber} · {plan.routeName}</p>
            </div>
          </div>
          <div className="w-full sm:w-56">
            <label className="text-xs font-semibold text-ink-500">Driver</label>
            <input
              className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm disabled:bg-ink-100 disabled:text-ink-500"
              placeholder="Nama driver"
              value={plan.driver}
              disabled={fieldsLocked}
              onChange={(e) => updateDispatch(vehicle.id, { driver: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div className="w-full sm:max-w-md sm:flex-1">
            <label className="text-xs font-semibold text-ink-500">Helper</label>
            <input
              className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm disabled:bg-ink-100 disabled:text-ink-500"
              placeholder="Nama helper"
              value={plan.helper}
              disabled={fieldsLocked}
              onChange={(e) => updateDispatch(vehicle.id, { helper: e.target.value })}
            />
          </div>
          {styrofoamTotal > 0 && (
            <p className="shrink-0 text-sm text-ink-500">
              Styrofoam: <span className="font-bold text-ink-900">{styrofoamTotal}</span>
            </p>
          )}
        </div>

        <div className="mt-4">
          {!isDeparted ? (
            <>
              <button
                disabled={!canDepart}
                onClick={() => departVehicle(vehicle.id, new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }))}
                className="w-full rounded-md bg-signal-600 py-2.5 text-sm font-bold text-white transition hover:bg-signal-700 disabled:cursor-not-allowed disabled:bg-ink-300 sm:w-auto sm:px-6"
              >
                Armada Berangkat
              </button>
              {!canDepart && <p className="mt-1.5 text-xs font-semibold text-amber-700">Isi nama driver & helper dulu</p>}
            </>
          ) : (
            <div className="space-y-2.5">
              <StatusPill tone="success">Berangkat {plan.departedAt}</StatusPill>
              {editingTime ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    className="rounded-md border border-ink-200 px-2 py-1 text-sm"
                    value={timeDraft}
                    onChange={(e) => setTimeDraft(e.target.value)}
                  />
                  <button
                    className="text-xs font-bold text-signal-700"
                    onClick={() => {
                      updateDispatch(vehicle.id, { departedAt: timeDraft })
                      setEditingTime(false)
                    }}
                  >
                    Simpan
                  </button>
                </div>
              ) : (
                <button className="block text-xs font-semibold text-signal-700 underline underline-offset-2" onClick={() => setEditingTime(true)}>
                  Ubah jam berangkat
                </button>
              )}
              <button
                onClick={() => setManagementUnlock((v) => !v)}
                className="block w-full rounded-md border border-signal-600 py-2 text-sm font-bold text-signal-700 hover:bg-signal-50"
              >
                {managementUnlock ? 'Kunci Kembali' : 'Ubah (Management)'}
              </button>
              <button
                onClick={() => cancelDeparture(vehicle.id)}
                className="block w-full rounded-md border border-ink-300 py-2 text-sm font-bold text-ink-600 hover:bg-ink-50"
              >
                ↺ Batalkan Berangkat
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto border-t border-ink-100">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="bg-ink-50 text-left text-[11px] font-bold uppercase tracking-wide text-ink-500">
              <th className="w-8 px-3 py-2"></th>
              <th className="px-3 py-2">Customer / No SO</th>
              <th className="px-3 py-2">Kode SKU</th>
              <th className="px-3 py-2">Nama SKU</th>
              <th className="px-3 py-2">Qty Kirim</th>
              <th className="px-3 py-2">Keranjang</th>
              <th className="px-3 py-2">Styrofoam</th>
              <th className="px-3 py-2">Status Kirim</th>
            </tr>
          </thead>
          <tbody>
            {soList.map((so, soIdx) => (
              <Fragment key={so.id}>
                {so.lines.map((line, lineIdx) => (
                  <tr key={line.id} className="border-t border-ink-100 align-top">
                    {lineIdx === 0 ? (
                      <td className="px-3 py-2.5 text-xs text-ink-400" rowSpan={so.lines.length}>
                        {soIdx + 1}
                      </td>
                    ) : null}
                    {lineIdx === 0 ? (
                      <td className="px-3 py-2.5" rowSpan={so.lines.length}>
                        <p className="font-bold text-ink-900">{customerNameOf(so.customerId)}</p>
                        <p className="text-xs text-ink-400">{so.soNumber}</p>
                      </td>
                    ) : null}
                    <td className="px-3 py-2.5 font-mono text-xs text-ink-500">{line.skuCode}</td>
                    <td className="px-3 py-2.5 text-ink-700">{line.skuName}</td>
                    <td className="px-3 py-2.5">
                      <input
                        type="number"
                        className="w-16 rounded-md border border-ink-200 px-2 py-1.5 text-sm disabled:bg-ink-100"
                        value={line.qtyKirim}
                        disabled={fieldsLocked}
                        onChange={(e) => updateSoLine(so.id, line.id, { qtyKirim: Number(e.target.value) })}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="number"
                        className="w-14 rounded-md border border-ink-200 px-2 py-1.5 text-center text-sm text-ink-400 placeholder:text-ink-300 disabled:bg-ink-100"
                        placeholder="—"
                        value={line.keranjang ?? ''}
                        disabled={fieldsLocked}
                        onChange={(e) => updateSoLine(so.id, line.id, { keranjang: Number(e.target.value) })}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="number"
                        className="w-14 rounded-md border border-ink-200 px-2 py-1.5 text-center text-sm text-ink-400 placeholder:text-ink-300 disabled:bg-ink-100"
                        placeholder="—"
                        value={line.styrofoam ?? ''}
                        disabled={fieldsLocked}
                        onChange={(e) => updateSoLine(so.id, line.id, { styrofoam: Number(e.target.value) })}
                      />
                    </td>
                    {lineIdx === 0 ? (
                      <td className="px-3 py-2.5" rowSpan={so.lines.length}>
                        <StatusPill tone={lineStatusMeta[line.lineStatus].tone}>{lineStatusMeta[line.lineStatus].label}</StatusPill>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </Fragment>
            ))}
            {soList.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-sm text-ink-400">
                  Belum ada SO yang di-assign ke armada ini. Atur di Dispatch Planning.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
