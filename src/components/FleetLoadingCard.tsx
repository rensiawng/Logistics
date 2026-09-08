import { Fragment, useState } from 'react'
import type { Fleet, LoadingAssignment, SalesOrder } from '../types'
import { fleetTheme, initials } from '../lib/fleetTheme'
import { useAppStore } from '../store/AppStore'
import { StatusPill } from './StatusPill'

const statusLabel: Record<string, { label: string; tone: 'neutral' | 'success' | 'warning' }> = {
  belum_kirim: { label: 'Belum Kirim', tone: 'neutral' },
  diterima: { label: 'Diterima', tone: 'success' },
  retur_sebagian: { label: 'Retur Sebagian', tone: 'warning' },
}

export function FleetLoadingCard({
  fleet,
  assignment,
  soList,
}: {
  fleet: Fleet
  assignment: LoadingAssignment
  soList: SalesOrder[]
}) {
  const { updateAssignment, departFleet, cancelDeparture, updateSoLine } = useAppStore()
  const theme = fleetTheme(fleet.type)
  const [editingTime, setEditingTime] = useState(false)
  const [timeDraft, setTimeDraft] = useState(assignment.departedAt ?? '')
  const [managementUnlock, setManagementUnlock] = useState(false)

  const allLines = soList.flatMap((so) => so.lines)
  const styrofoamTotal = allLines.reduce((s, l) => s + (l.styrofoam ?? 0), 0)
  const canDepart = assignment.driver.trim().length > 0 && assignment.helper.trim().length > 0
  const isDeparted = assignment.status === 'berangkat'
  const fieldsLocked = isDeparted && !managementUnlock

  return (
    <div className={`overflow-hidden rounded-xl border-l-4 ${theme.border} bg-white shadow-sm`}>
      <div className={`${theme.cardBg} p-4`}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-full ${theme.avatarBg} text-sm font-bold text-white`}>
              {initials(fleet.name)}
            </div>
            <div>
              <p className="text-lg font-bold text-navy-900">{fleet.name}</p>
              <p className="text-xs text-slate-500">{soList.length} SO · {fleet.plateNumber}</p>
            </div>
          </div>
          <div className="w-full sm:w-56">
            <label className="text-xs font-semibold text-slate-500">Driver</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-500"
              placeholder="Nama driver"
              value={assignment.driver}
              disabled={fieldsLocked}
              onChange={(e) => updateAssignment(fleet.id, { driver: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div className="w-full sm:max-w-md sm:flex-1">
            <label className="text-xs font-semibold text-slate-500">Helper</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm disabled:bg-slate-100 disabled:text-slate-500"
              placeholder="Nama helper"
              value={assignment.helper}
              disabled={fieldsLocked}
              onChange={(e) => updateAssignment(fleet.id, { helper: e.target.value })}
            />
          </div>
          {styrofoamTotal > 0 && (
            <p className="text-sm text-slate-500 shrink-0">
              Styrofoam: <span className="font-bold text-navy-900">{styrofoamTotal}</span>
            </p>
          )}
        </div>

        <div className="mt-4">
          {!isDeparted ? (
            <>
              <button
                disabled={!canDepart}
                onClick={() => departFleet(fleet.id, new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }))}
                className="w-full rounded-lg bg-brand-500 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-400/60 sm:w-auto sm:px-6"
              >
                Armada Berangkat
              </button>
              {!canDepart && <p className="mt-1.5 text-xs font-semibold text-amber-600">Isi nama driver & helper dulu</p>}
            </>
          ) : (
            <div className="space-y-2.5">
              <StatusPill tone="success">Berangkat {assignment.departedAt}</StatusPill>
              {editingTime ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                    value={timeDraft}
                    onChange={(e) => setTimeDraft(e.target.value)}
                  />
                  <button
                    className="text-xs font-bold text-brand-600"
                    onClick={() => {
                      updateAssignment(fleet.id, { departedAt: timeDraft })
                      setEditingTime(false)
                    }}
                  >
                    Simpan
                  </button>
                </div>
              ) : (
                <button className="block text-xs font-semibold text-brand-600 underline underline-offset-2" onClick={() => setEditingTime(true)}>
                  Ubah jam berangkat
                </button>
              )}
              <button
                onClick={() => setManagementUnlock((v) => !v)}
                className="block w-full rounded-lg border border-brand-500 py-2 text-sm font-bold text-brand-600 hover:bg-brand-50"
              >
                {managementUnlock ? 'Kunci Kembali' : 'Ubah (Management)'}
              </button>
              <button
                onClick={() => cancelDeparture(fleet.id)}
                className="block w-full rounded-lg border border-slate-300 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                ↺ Batalkan Berangkat
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-t border-slate-100 bg-slate-50 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
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
                  <tr key={line.id} className="border-t border-slate-100 align-top">
                    {lineIdx === 0 ? (
                      <td className="px-3 py-2.5 text-xs text-slate-400" rowSpan={so.lines.length}>
                        {soIdx + 1}
                      </td>
                    ) : null}
                    {lineIdx === 0 ? (
                      <td className="px-3 py-2.5" rowSpan={so.lines.length}>
                        <p className="font-bold text-navy-900">{so.customerName}</p>
                        <p className="text-xs text-slate-400">{so.soNumber}</p>
                      </td>
                    ) : null}
                    <td className="px-3 py-2.5 font-mono text-xs text-slate-500">{line.skuCode}</td>
                    <td className="px-3 py-2.5 text-slate-700">{line.skuName}</td>
                    <td className="px-3 py-2.5">
                      <input
                        type="number"
                        className="w-16 rounded-lg border border-slate-300 px-2 py-1.5 text-sm disabled:bg-slate-100"
                        value={line.qtyKirim}
                        disabled={fieldsLocked}
                        onChange={(e) => updateSoLine(so.id, line.id, { qtyKirim: Number(e.target.value) })}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="number"
                        className="w-14 rounded-lg border border-slate-300 px-2 py-1.5 text-center text-sm text-slate-400 placeholder:text-slate-300 disabled:bg-slate-100"
                        placeholder="—"
                        value={line.keranjang ?? ''}
                        disabled={fieldsLocked}
                        onChange={(e) => updateSoLine(so.id, line.id, { keranjang: Number(e.target.value) })}
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="number"
                        className="w-14 rounded-lg border border-slate-300 px-2 py-1.5 text-center text-sm text-slate-400 placeholder:text-slate-300 disabled:bg-slate-100"
                        placeholder="—"
                        value={line.styrofoam ?? ''}
                        disabled={fieldsLocked}
                        onChange={(e) => updateSoLine(so.id, line.id, { styrofoam: Number(e.target.value) })}
                      />
                    </td>
                    {lineIdx === 0 ? (
                      <td className="px-3 py-2.5" rowSpan={so.lines.length}>
                        <StatusPill tone={statusLabel[line.statusKirim].tone}>{statusLabel[line.statusKirim].label}</StatusPill>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </Fragment>
            ))}
            {soList.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-6 text-center text-sm text-slate-400">
                  Belum ada SO yang di-assign ke armada ini. Atur di Route Planner.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
