import type { DocumentStatus, DocumentType } from '../types'

export const documentTypeLabel: Record<DocumentType, string> = {
  delivery_order: 'Delivery Order',
  invoice: 'Invoice',
  packing_list: 'Packing List',
  pod: 'Proof of Delivery',
  customs_declaration: 'Customs Declaration (PIB)',
  phyto_certificate: 'Phytosanitary Certificate',
  cold_chain_log: 'Cold Chain Log',
}

export const documentStatusMeta: Record<DocumentStatus, { label: string; tone: 'neutral' | 'success' | 'warning' | 'danger' | 'info' }> = {
  missing: { label: 'Missing', tone: 'danger' },
  draft: { label: 'Draft', tone: 'warning' },
  issued: { label: 'Issued', tone: 'info' },
  received: { label: 'Received', tone: 'success' },
}

export const allDocumentStatuses: DocumentStatus[] = ['missing', 'draft', 'issued', 'received']
