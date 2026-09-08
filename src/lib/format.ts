export function formatRupiah(value: number) {
  return 'Rp ' + Math.round(value).toLocaleString('id-ID')
}

export function formatDateLong(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatDateShort(iso: string) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

export function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function daysUntil(iso: string) {
  return Math.round((new Date(iso + 'T00:00:00').getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}
