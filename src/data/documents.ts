import type { ShipmentDocument } from '../types'

export const shipmentDocuments: ShipmentDocument[] = [
  // SO1 - PT Astro, today, import mango pulp
  { id: 'd1', soId: 'so1', type: 'delivery_order', status: 'issued', dueDate: '2026-09-08', note: null },
  { id: 'd2', soId: 'so1', type: 'invoice', status: 'draft', dueDate: '2026-09-08', note: null },
  { id: 'd3', soId: 'so1', type: 'packing_list', status: 'issued', dueDate: '2026-09-08', note: null },
  { id: 'd4', soId: 'so1', type: 'pod', status: 'missing', dueDate: '2026-09-08', note: null },
  { id: 'd5', soId: 'so1', type: 'phyto_certificate', status: 'missing', dueDate: '2026-09-08', note: 'Wajib untuk batch impor mangga Thailand' },

  // SO2 - Antony, today
  { id: 'd6', soId: 'so2', type: 'delivery_order', status: 'issued', dueDate: '2026-09-08', note: null },
  { id: 'd7', soId: 'so2', type: 'invoice', status: 'issued', dueDate: '2026-09-08', note: null },
  { id: 'd8', soId: 'so2', type: 'packing_list', status: 'issued', dueDate: '2026-09-08', note: null },
  { id: 'd9', soId: 'so2', type: 'pod', status: 'missing', dueDate: '2026-09-08', note: null },

  // SO3 - Agreya, delivered
  { id: 'd10', soId: 'so3', type: 'delivery_order', status: 'issued', dueDate: '2026-09-07', note: null },
  { id: 'd11', soId: 'so3', type: 'invoice', status: 'issued', dueDate: '2026-09-07', note: null },
  { id: 'd12', soId: 'so3', type: 'packing_list', status: 'issued', dueDate: '2026-09-07', note: null },
  { id: 'd13', soId: 'so3', type: 'pod', status: 'received', dueDate: '2026-09-07', note: null },

  // SO4 - Adhya, delivered but POD not yet scanned
  { id: 'd14', soId: 'so4', type: 'delivery_order', status: 'issued', dueDate: '2026-09-07', note: null },
  { id: 'd15', soId: 'so4', type: 'invoice', status: 'issued', dueDate: '2026-09-07', note: null },
  { id: 'd16', soId: 'so4', type: 'packing_list', status: 'issued', dueDate: '2026-09-07', note: null },
  { id: 'd17', soId: 'so4', type: 'pod', status: 'draft', dueDate: '2026-09-07', note: 'Driver sudah foto, belum diupload ke sistem' },

  // SO5 - Gedong, closed
  { id: 'd18', soId: 'so5', type: 'delivery_order', status: 'issued', dueDate: '2026-09-07', note: null },
  { id: 'd19', soId: 'so5', type: 'invoice', status: 'issued', dueDate: '2026-09-07', note: null },
  { id: 'd20', soId: 'so5', type: 'packing_list', status: 'issued', dueDate: '2026-09-07', note: null },
  { id: 'd21', soId: 'so5', type: 'pod', status: 'received', dueDate: '2026-09-07', note: null },

  // SO6 - Quantum, today planned
  { id: 'd22', soId: 'so6', type: 'delivery_order', status: 'issued', dueDate: '2026-09-08', note: null },
  { id: 'd23', soId: 'so6', type: 'invoice', status: 'draft', dueDate: '2026-09-08', note: null },
  { id: 'd24', soId: 'so6', type: 'packing_list', status: 'draft', dueDate: '2026-09-08', note: null },
  { id: 'd25', soId: 'so6', type: 'pod', status: 'missing', dueDate: '2026-09-08', note: null },

  // SO7 - Coco Food, today, contains imported avocado blend
  { id: 'd26', soId: 'so7', type: 'delivery_order', status: 'issued', dueDate: '2026-09-08', note: null },
  { id: 'd27', soId: 'so7', type: 'invoice', status: 'issued', dueDate: '2026-09-08', note: null },
  { id: 'd28', soId: 'so7', type: 'packing_list', status: 'issued', dueDate: '2026-09-08', note: null },
  { id: 'd29', soId: 'so7', type: 'pod', status: 'missing', dueDate: '2026-09-08', note: null },
  { id: 'd30', soId: 'so7', type: 'customs_declaration', status: 'missing', dueDate: '2026-09-08', note: 'Salinan PIB untuk avocado blend NZ belum dilampirkan' },

  // SO8 - Coco Food, today
  { id: 'd31', soId: 'so8', type: 'delivery_order', status: 'issued', dueDate: '2026-09-08', note: null },
  { id: 'd32', soId: 'so8', type: 'invoice', status: 'issued', dueDate: '2026-09-08', note: null },
  { id: 'd33', soId: 'so8', type: 'packing_list', status: 'issued', dueDate: '2026-09-08', note: null },
  { id: 'd34', soId: 'so8', type: 'pod', status: 'missing', dueDate: '2026-09-08', note: null },

  // SO9 - draft, nothing yet
  { id: 'd35', soId: 'so9', type: 'delivery_order', status: 'missing', dueDate: '2026-09-10', note: null },

  // SO10 - on hold
  { id: 'd36', soId: 'so10', type: 'delivery_order', status: 'missing', dueDate: '2026-09-09', note: 'Ditahan sampai approval kredit selesai' },
]
