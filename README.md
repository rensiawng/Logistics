# SHB Ops — Logistics Console

An internal logistics operations console for a fresh-produce trading/import-export company (frozen & fresh fruit distribution). Covers the full operational surface end to end: sales orders, dispatch planning, delivery/route tracking, loading plans, drivers & helpers, fleet/vehicles, petty cash, shipment documents, approvals, shipment status, operational alerts, task tracking, and customer/supplier logistics info.

This is a purpose-built redesign — not a visual copy of any reference system. Visual identity: light "control tower" enterprise theme (warm graphite ink palette + a single deep-teal accent), grouped sidebar navigation, rectangular dot-indicator status badges, square vehicle/entity avatars, and dense data tables — deliberately different from soft rounded mobile-card UIs.

## Stack

React + TypeScript + Vite, Tailwind CSS v4, React Router, Recharts, lucide-react icons. All data is in-memory mock data (`src/data/`) wired through a React context store (`src/store/AppStore.tsx`) — no backend, state resets on reload.

## Modules

**Operations**
- **Dashboard** — control-tower overview: KPIs, active alerts feed, pending approvals, fleet status, SO status funnel.
- **Sales Orders** — every SO from draft to POD received, filterable by status, expandable to line items with manual status override.
- **Dispatch Planning** — assign each SO to a vehicle/route for the delivery date before it enters Loading Plan.
- **Loading Plan** — per-vehicle driver/helper assignment, qty kirim/keranjang/styrofoam per SKU line, and the Armada Berangkat → Ubah jam berangkat / Ubah (Management) / Batalkan Berangkat flow.
- **Shipment Tracking** — Kanban board across the full shipment lifecycle plus live vehicle telemetry (location, ETA, reefer temperature chart with cold-chain excursion alerts).

**Resources**
- **Fleet & Vehicles** — master vehicle data: STNK/KIR/insurance expiry, odometer vs. next service threshold.
- **Drivers & Helpers** — personnel master data and performance scorecards (on-time rate, temp-excursion average, incidents, SIM expiry).

**Finance**
- **Petty Cash** — Perlu Verifikasi → Siap Refill → Nunggu Approval Finance pipeline with itemized receipts and over-budget flagging.

**Compliance**
- **Documents** — shipment document tracker per SO (DO, invoice, packing list, POD, customs declaration, phytosanitary certificate) with status and due dates.
- **Approvals** — unified approval queue for petty cash refills, discounts, credit-term exceptions, route changes, and document exceptions.

**Planning**
- **Tasks** — ops task board (To Do / In Progress / Done) by category, priority, and assignee, linkable to a SO.
- **Alerts** — every operational alert (cold chain, petty cash, compliance, fleet, SLA) in one place, filterable and resolvable.

**Partners**
- **Customers & Suppliers** — logistics-relevant partner data: delivery addresses, dock hours, cold-chain requirements, credit terms, incoterms, lead times.

**Insights**
- **Reports** — on-time delivery trend, petty cash spend vs. budget, document compliance trend, SKU volume, and a plain-language weekly insight list.

## Run locally

```bash
npm install
npm run dev
```
