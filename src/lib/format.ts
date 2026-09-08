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
